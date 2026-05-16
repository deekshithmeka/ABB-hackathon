from __future__ import annotations

import random


SENSORS = [
	{"sensor_name": "Pump A", "unit": "celsius", "normal_min": 20.0, "normal_max": 80.0},
	{"sensor_name": "Motor B", "unit": "rpm", "normal_min": 500.0, "normal_max": 3000.0},
	{"sensor_name": "Boiler C", "unit": "bar", "normal_min": 1.0, "normal_max": 10.0},
	{"sensor_name": "Compressor D", "unit": "celsius", "normal_min": 15.0, "normal_max": 60.0},
	{"sensor_name": "Valve E", "unit": "bar", "normal_min": 0.5, "normal_max": 5.0},
	{"sensor_name": "Cooling Fan", "unit": "rpm", "normal_min": 200.0, "normal_max": 1500.0},
	{"sensor_name": "Pressure Tank", "unit": "bar", "normal_min": 2.0, "normal_max": 12.0},
	{"sensor_name": "Heat Exchanger", "unit": "celsius", "normal_min": 30.0, "normal_max": 90.0},
	{"sensor_name": "Generator", "unit": "volt", "normal_min": 210.0, "normal_max": 240.0},
	{"sensor_name": "Flow Meter", "unit": "l/min", "normal_min": 10.0, "normal_max": 100.0},
]


def generate_readings() -> list[dict[str, float | str]]:
	readings: list[dict[str, float | str]] = []

	for sensor in SENSORS:
		normal_min = sensor["normal_min"]
		normal_max = sensor["normal_max"]
		chance = random.random()

		if chance < 0.15:
			value = random.uniform(normal_max * 1.2, normal_max * 1.4)
		elif chance < 0.20:
			value = random.uniform(normal_min * 0.8, normal_min)
		else:
			value = random.uniform(normal_min, normal_max)

		readings.append(
			{
				"sensor_name": sensor["sensor_name"],
				"value": value,
				"unit": sensor["unit"],
				"normal_max": normal_max,
				"normal_min": normal_min,
			}
		)

	return readings
