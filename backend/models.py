from typing import Optional

from pydantic import BaseModel, Field


class SensorReading(BaseModel):
	sensor_name: str
	value: float
	unit: str
	normal_max: float


class AlarmOut(BaseModel):
	id: Optional[int] = None
	sensor_name: str
	value: float
	severity: str
	explanation: str
	affected_nodes: list[str] = Field(default_factory=list)
	timestamp: str = ""


class DashboardData(BaseModel):
	sensors: list[SensorReading]
	alarms: list[AlarmOut]
	graph_nodes: list[dict]
	graph_edges: list[dict]
