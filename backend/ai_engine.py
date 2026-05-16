from __future__ import annotations

import os
from typing import Any

import httpx
import networkx as nx
from dotenv import load_dotenv


load_dotenv()


DEPENDENCY_GRAPH = nx.DiGraph()
DEPENDENCY_GRAPH.add_edges_from(
	[
		("Pump A", "Motor B"),
		("Pump A", "Cooling Fan"),
		("Motor B", "Boiler C"),
		("Boiler C", "Heat Exchanger"),
		("Compressor D", "Valve E"),
		("Compressor D", "Pressure Tank"),
		("Pressure Tank", "Flow Meter"),
		("Generator", "Pump A"),
		("Generator", "Compressor D"),
	]
)


def classify_severity(value: float, normal_min: float, normal_max: float) -> str:
	if value > normal_max * 1.2 or value < normal_min * 0.8:
		return "critical"
	if value > normal_max * 1.05 or value < normal_min * 0.95:
		return "warning"
	return "info"


def get_affected_nodes(sensor_name: str) -> list[str]:
	if not DEPENDENCY_GRAPH.has_node(sensor_name):
		return []
	return sorted(nx.descendants(DEPENDENCY_GRAPH, sensor_name))


async def get_ai_explanation(sensor_name: str, value: float, unit: str, severity: str) -> str:
	api_key = os.getenv("GEMINI_API_KEY")
	if not api_key:
		return f"{sensor_name} reading is {severity} — check immediately."

	endpoint = (
		"https://generativelanguage.googleapis.com/v1beta/models/"
		f"gemini-2.0-flash:generateContent?key={api_key}"
	)
	payload = {
		"contents": [
			{
				"parts": [
					{
						"text": (
							f"In one short sentence, explain why {sensor_name} reading of {value} "
							f"{unit} is {severity} in an industrial system."
						)
					}
				]
			}
		]
	}

	try:
		async with httpx.AsyncClient(timeout=20.0) as client:
			response = await client.post(endpoint, json=payload)
			response.raise_for_status()
			data: dict[str, Any] = response.json()
			return (
				data["candidates"][0]["content"]["parts"][0]["text"].strip()
			)
	except Exception:
		return f"{sensor_name} reading is {severity} — check immediately."


async def process_reading(
	sensor_name: str,
	value: float,
	unit: str,
	normal_min: float,
	normal_max: float,
) -> dict[str, Any]:
	severity = classify_severity(value, normal_min, normal_max)
	affected_nodes = get_affected_nodes(sensor_name)

	if severity in {"critical", "warning"}:
		explanation = await get_ai_explanation(sensor_name, value, unit, severity)
	else:
		explanation = "Reading is within normal range."

	return {
		"sensor_name": sensor_name,
		"value": value,
		"unit": unit,
		"severity": severity,
		"explanation": explanation,
		"affected_nodes": affected_nodes,
	}
