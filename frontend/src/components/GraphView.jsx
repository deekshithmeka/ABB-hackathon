import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const GraphViewContent = ({ nodes: initialNodes = [], edges: initialEdges = [], alarms = [] }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Create formatted nodes with grid layout
  useEffect(() => {
    const gridCols = Math.ceil(Math.sqrt(initialNodes.length)) || 1;
    const gridSpacing = 180;

    const formattedNodes = initialNodes.map((node, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;

      const alarm = alarms?.find((a) => a.sensor_name === node.id);
      let bgColor = '#374151'; // gray-700
      let textColor = 'white';

      if (alarm?.severity === 'critical') {
        bgColor = '#dc2626'; // red
        textColor = 'white';
      } else if (alarm?.severity === 'warning') {
        bgColor = '#f59e0b'; // amber
        textColor = '#1f2937'; // dark
      }

      return {
        id: node.id,
        data: { label: node.label },
        position: {
          x: col * gridSpacing,
          y: row * gridSpacing,
        },
        style: {
          background: bgColor,
          color: textColor,
          padding: '10px',
          borderRadius: '6px',
          fontWeight: 'bold',
          border: '2px solid transparent',
          width: 'auto',
          minWidth: '100px',
          textAlign: 'center',
        },
      };
    });

    setNodes(formattedNodes);
  }, [initialNodes, alarms, setNodes]);

  // Format edges
  useEffect(() => {
    const formattedEdges = initialEdges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: true,
    }));
    setEdges(formattedEdges);
  }, [initialEdges, setEdges]);

  // Find all downstream nodes
  const getDownstreamNodes = (nodeId) => {
    const downstream = new Set();
    const visited = new Set();

    const traverse = (id) => {
      if (visited.has(id)) return;
      visited.add(id);

      const connectedEdges = initialEdges.filter((e) => e.source === id);
      connectedEdges.forEach((edge) => {
        downstream.add(edge.target);
        traverse(edge.target);
      });
    };

    traverse(nodeId);
    return Array.from(downstream);
  };

  const handleNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node.id);
      const downstream = getDownstreamNodes(node.id);
      setHighlightedNodes(downstream);

      // Update node styles
      setNodes((nds) =>
        nds.map((n) => {
          const isSelected = n.id === node.id;
          const isHighlighted = downstream.includes(n.id);

          let borderColor = 'transparent';
          if (isSelected) borderColor = '#3b82f6'; // blue
          else if (isHighlighted) borderColor = '#f97316'; // orange

          return {
            ...n,
            style: {
              ...n.style,
              border: `3px solid ${borderColor}`,
            },
          };
        })
      );
    },
    [initialEdges, setNodes]
  );

  return (
    <div className="w-full">
      <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '350px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background color="#374151" variant="dots" />
          <Controls />
        </ReactFlow>
      </div>

      {highlightedNodes.length > 0 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm font-semibold text-orange-900 mb-2">
            Affected nodes when {selectedNode} fails:
          </p>
          <div className="flex flex-wrap gap-2">
            {highlightedNodes.map((nodeId) => (
              <span
                key={nodeId}
                className="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm"
              >
                {nodeId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GraphView = ({ nodes = [], edges = [], alarms = [] }) => {
  return (
    <ReactFlowProvider>
      <GraphViewContent nodes={nodes} edges={edges} alarms={alarms} />
    </ReactFlowProvider>
  );
};
