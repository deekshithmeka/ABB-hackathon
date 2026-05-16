import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Dashboard } from './components/Dashboard';
import { AlarmPanel } from './components/AlarmPanel';
import { GraphView } from './components/GraphView';
import { RoleSelector } from './components/RoleSelector';

function App() {
  const [role, setRole] = useState('operator');
  const { dashboardData, isConnected } = useWebSocket();

  const sensors = dashboardData?.sensors || [];
  const alarms = dashboardData?.alarms || [];
  const graph_nodes = dashboardData?.graph_nodes || [];
  const graph_edges = dashboardData?.graph_edges || [];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Smart HMI</h1>
            <p className="text-sm text-gray-400">ABB Accelerator 2026</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-400">Live</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-red-400">Disconnected</span>
                </>
              )}
            </div>

            <RoleSelector role={role} onRoleChange={setRole} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* Left Panel - Dashboard (60%) */}
        <div className="w-3/5 overflow-y-auto">
          <Dashboard sensors={sensors} alarms={alarms} />
        </div>

        {/* Right Panel - Alarm Panel (40%) */}
        <div className="w-2/5 overflow-hidden">
          <AlarmPanel alarms={alarms} role={role} />
        </div>
      </div>

      {/* Bottom Section - Graph View */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-6">
        <h2 className="text-xl font-bold text-white mb-4">Alarm dependency graph</h2>
        <GraphView nodes={graph_nodes} edges={graph_edges} alarms={alarms} />
      </div>
    </div>
  );
}

export default App;
