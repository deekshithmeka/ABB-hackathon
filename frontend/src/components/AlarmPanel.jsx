const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-600 text-white';
    case 'warning':
      return 'bg-amber-500 text-gray-900';
    default:
      return 'bg-gray-400 text-gray-900';
  }
};

const getSeverityOrder = (severity) => {
  switch (severity) {
    case 'critical':
      return 0;
    case 'warning':
      return 1;
    default:
      return 2;
  }
};

export const AlarmPanel = ({ alarms = [], role = 'operator' }) => {
  let filteredAlarms = alarms;

  if (role === 'operator') {
    filteredAlarms = alarms.filter(
      (alarm) => alarm.severity === 'critical' || alarm.severity === 'warning'
    );
    filteredAlarms = filteredAlarms.slice(0, 5);
  } else {
    filteredAlarms = alarms.slice(0, 50);
  }

  filteredAlarms.sort(
    (a, b) => getSeverityOrder(a.severity) - getSeverityOrder(b.severity)
  );

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg overflow-y-auto h-full">
      <h2 className="text-lg font-bold mb-4">Alarms</h2>

      {filteredAlarms.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          All systems normal
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlarms.map((alarm, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-3 border-l-4"
              style={{
                borderColor:
                  alarm.severity === 'critical'
                    ? '#dc2626'
                    : alarm.severity === 'warning'
                    ? '#f59e0b'
                    : '#9ca3af',
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white">{alarm.sensor_name}</span>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${getSeverityColor(
                    alarm.severity
                  )}`}
                >
                  {alarm.severity.charAt(0).toUpperCase() + alarm.severity.slice(1)}
                </span>
              </div>

              <div className="text-xs text-gray-400 mb-2">
                {alarm.value.toFixed(2)} {alarm.unit}
              </div>

              <div className="text-sm italic text-gray-200 mb-2">
                {alarm.explanation}
              </div>

              {alarm.affected_nodes && alarm.affected_nodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {alarm.affected_nodes.map((node, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 text-xs border border-gray-500 text-gray-300 rounded"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 text-right">
                {alarm.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
