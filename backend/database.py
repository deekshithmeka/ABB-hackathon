from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, Float, Integer, MetaData, String, Table, Column, func, select
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine


DATABASE_URL = "sqlite+aiosqlite:///./hmi.db"

metadata = MetaData()

alarms_table = Table(
	"alarms",
	metadata,
	Column("id", Integer, primary_key=True, autoincrement=True),
	Column("sensor_name", String, nullable=False),
	Column("value", Float, nullable=False),
	Column("severity", String, nullable=False),
	Column("explanation", String, nullable=False),
	Column("affected_nodes", String, nullable=False, default=""),
	Column("timestamp", DateTime(timezone=False), nullable=False, server_default=func.datetime("now")),
)

engine: AsyncEngine = create_async_engine(DATABASE_URL, future=True)


async def init_db() -> None:
	async with engine.begin() as connection:
		await connection.run_sync(metadata.create_all)


async def save_alarm(
	sensor_name: str,
	value: float,
	severity: str,
	explanation: str,
	affected_nodes: list[str],
) -> None:
	affected_nodes_csv = ",".join(affected_nodes)

	async with engine.begin() as connection:
		await connection.execute(
			alarms_table.insert().values(
				sensor_name=sensor_name,
				value=value,
				severity=severity,
				explanation=explanation,
				affected_nodes=affected_nodes_csv,
			)
		)


async def get_recent_alarms(limit: int = 50) -> list[dict[str, Any]]:
	query = (
		select(alarms_table)
		.order_by(alarms_table.c.timestamp.desc(), alarms_table.c.id.desc())
		.limit(limit)
	)

	async with engine.begin() as connection:
		result = await connection.execute(query)
		rows = result.mappings().all()

	alarms: list[dict[str, Any]] = []
	for row in rows:
		affected_nodes = row["affected_nodes"]
		alarms.append(
			{
				"id": row["id"],
				"sensor_name": row["sensor_name"],
				"value": row["value"],
				"severity": row["severity"],
				"explanation": row["explanation"],
				"affected_nodes": affected_nodes.split(",") if affected_nodes else [],
				"timestamp": row["timestamp"].isoformat() if isinstance(row["timestamp"], datetime) else row["timestamp"],
			}
		)

	return alarms
