import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export const Dashboard = ({ sensors = [], alarms = [] }) => {
  const historyRef = useRef({});
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const updated = { ...historyRef.current };

    sensors.forEach((sensor) => {
      const key = sensor.sensor_name;

      if (!updated[key]) {
        updated[key] = [];
      }

      updated[key] = [
        ...updated[key],
        {
          value: sensor.value,
          timestamp: new Date().toISOString(),
        },
      ];

      if (updated[key].length > 30) {
        updated[key] = updated[key].slice(-30);
      }
    });

    historyRef.current = updated;
    setChartData(updated);
  }, [sensors]);

  const getLineColor = (sensorName) => {
    const alarm = alarms.find((a) => a.sensor_name === sensorName);
    if (!alarm) return '#22c55e';
    if (alarm.severity === 'critical') return '#ef4444';
    if (alarm.severity === 'warning') return '#f59e0b';
    return '#22c55e';
  };

  const getBorderColor = (sensorName) => {
    const alarm = alarms.find((a) => a.sensor_name === sensorName);
    if (!alarm) return 'border-green-500';
    if (alarm.severity === 'critical') return 'border-red-500';
    if (alarm.severity === 'warning') return 'border-amber-500';
    return 'border-green-500';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Sensor Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensors.map((sensor) => {
          const color = getLineColor(sensor.sensor_name);
          const borderClass = getBorderColor(sensor.sensor_name);
          const history = chartData[sensor.sensor_name] || [];

          return (
            <div
              key={sensor.sensor_name}
              className={`bg-gray-800 rounded-lg p-4 border-2 ${borderClass}`}
            >
              <h2 className="text-lg font-bold text-white mb-2">
                {sensor.sensor_name}
              </h2>

              <div className="text-4xl font-bold text-white mb-4">
                {sensor.value.toFixed(2)}
                <span className="text-sm text-gray-400 ml-2">{sensor.unit}</span>
              </div>

              <div className="h-30 bg-gray-700 rounded">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={history} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#374151', border: 'none' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      dot={false}
                      isAnimationActive={false}
                      strokeWidth={2}
                    />
                    {history.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        dot={{
                          r: 4,
                          fill: color,
                        }}
                        isAnimationActive={false}
                        strokeWidth={0}
                        data={[history[history.length - 1]]}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Range: {sensor.normal_min} - {sensor.normal_max}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
