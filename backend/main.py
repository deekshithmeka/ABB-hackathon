from __future__ import annotations

import asyncio
import json

from apscheduler.schedulers.asyncio import AsyncIOScheduler  # type: ignore[import-not-found]
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from ai_engine import DEPENDENCY_GRAPH, process_reading
from database import get_recent_alarms, init_db, save_alarm
from models import AlarmOut, DashboardData, SensorReading
from simulator import generate_readings


app = FastAPI(title="Smart HMI API")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

connected_clients: set[WebSocket] = set()
latest_readings: list[dict] = []
latest_readings_lock = asyncio.Lock()
scheduler = AsyncIOScheduler()


async def broadcast_dashboard(payload: dict) -> None:
	disconnected_clients: set[WebSocket] = set()

	for client in list(connected_clients):
		try:
			await client.send_text(json.dumps(payload, default=str))
		except Exception:
			disconnected_clients.add(client)

	for client in disconnected_clients:
		connected_clients.discard(client)


async def update_dashboard() -> None:
	generated_readings = generate_readings()
	sensor_models: list[SensorReading] = []
	alarm_models: list[AlarmOut] = []

	for reading in generated_readings:
		processed = await process_reading(
			reading["sensor_name"],
			reading["value"],
			reading["unit"],
			reading["normal_min"],
			reading["normal_max"],
		)

		await save_alarm(
			processed["sensor_name"],
			processed["value"],
			processed["severity"],
			processed["explanation"],
			processed["affected_nodes"],
		)

		sensor_models.append(SensorReading(**reading))
		alarm_models.append(AlarmOut(**processed))

	dashboard = DashboardData(
		sensors=sensor_models,
		alarms=alarm_models,
		graph_nodes=[{"id": node, "label": node} for node in DEPENDENCY_GRAPH.nodes],
		graph_edges=[{"source": source, "target": target} for source, target in DEPENDENCY_GRAPH.edges],
	)

	async with latest_readings_lock:
		latest_readings.clear()
		latest_readings.extend([sensor.model_dump() for sensor in sensor_models])

	await broadcast_dashboard(dashboard.model_dump())


@app.on_event("startup")
async def startup_event() -> None:
	await init_db()
	scheduler.add_job(
		update_dashboard,
		"interval",
		seconds=2,
		id="update_dashboard",
		replace_existing=True,
		max_instances=1,
		coalesce=True,
	)
	scheduler.start()
	await update_dashboard()


@app.on_event("shutdown")
async def shutdown_event() -> None:
	if scheduler.running:
		scheduler.shutdown(wait=False)


@app.get("/alarms")
async def alarms() -> list[dict]:
	return await get_recent_alarms(50)


@app.get("/sensors")
async def sensors() -> list[dict]:
	async with latest_readings_lock:
		return list(latest_readings)


@app.get("/graph")
async def graph() -> dict[str, list[dict]]:
	return {
		"nodes": [{"id": node, "label": node} for node in DEPENDENCY_GRAPH.nodes],
		"edges": [{"source": source, "target": target} for source, target in DEPENDENCY_GRAPH.edges],
	}


@app.get("/")
async def root() -> dict[str, str]:
	return {"status": "HMI API running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
	await websocket.accept()
	connected_clients.add(websocket)

	try:
		async with latest_readings_lock:
			await websocket.send_text(json.dumps(latest_readings, default=str))

		while True:
			await websocket.receive_text()
	except WebSocketDisconnect:
		pass
	finally:
		connected_clients.discard(websocket)
