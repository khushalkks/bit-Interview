import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cpu, Globe, Layers, HardDrive, Plus, Trash2, Zap, Play, CheckCircle2, ArrowRight } from 'lucide-react';

const NODE_TYPES = [
  { type: 'api_gateway', label: 'API Gateway', icon: Globe, color: 'from-cyan-500 to-blue-600', badge: 'Ingress' },
  { type: 'load_balancer', label: 'Load Balancer', icon: Cpu, color: 'from-indigo-500 to-violet-600', badge: 'L7 Router' },
  { type: 'microservice', label: 'Microservice Node', icon: Server, color: 'from-purple-500 to-pink-600', badge: 'App Cluster' },
  { type: 'redis_cache', label: 'Redis Cache Cluster', icon: Zap, color: 'from-rose-500 to-red-600', badge: 'In-Memory O(1)' },
  { type: 'database', label: 'Postgres Shard DB', icon: Database, color: 'from-emerald-500 to-teal-600', badge: 'Primary DB' },
  { type: 'kafka_queue', label: 'Kafka Event Bus', icon: Layers, color: 'from-amber-500 to-orange-600', badge: 'Pub/Sub Stream' },
  { type: 'cdn', label: 'Cloudflare CDN', icon: HardDrive, color: 'from-blue-400 to-cyan-500', badge: 'Edge Cache' }
];

export default function SystemDesignWhiteboard({ onEvaluateGraph }) {
  const [nodes, setNodes] = useState([
    { id: 'node-1', type: 'api_gateway', label: 'API Gateway', x: 80, y: 150 },
    { id: 'node-2', type: 'load_balancer', label: 'Load Balancer', x: 300, y: 150 },
    { id: 'node-3', type: 'microservice', label: 'Auth & User Service', x: 550, y: 80 },
    { id: 'node-4', type: 'microservice', label: 'Payment Engine', x: 550, y: 220 },
    { id: 'node-5', type: 'redis_cache', label: 'Session Cache', x: 800, y: 80 },
    { id: 'node-6', type: 'database', label: 'PostgreSQL Primary', x: 800, y: 220 }
  ]);

  const [connections, setConnections] = useState([
    { from: 'node-1', to: 'node-2' },
    { from: 'node-2', to: 'node-3' },
    { from: 'node-2', to: 'node-4' },
    { from: 'node-3', to: 'node-5' },
    { from: 'node-4', to: 'node-6' }
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const canvasRef = useRef(null);

  // Add node from toolbox
  const addNode = (nodeType) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      label: `${nodeType.label} #${nodes.length + 1}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150
    };
    setNodes(prev => [...prev, newNode]);
  };

  // Node Drag Handler
  const handleNodeDrag = (id, info) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y } : n));
  };

  // Handle node selection for connection
  const handleNodeClick = (id) => {
    if (connectingFrom) {
      if (connectingFrom !== id && !connections.some(c => c.from === connectingFrom && c.to === id)) {
        setConnections(prev => [...prev, { from: connectingFrom, to: id }]);
      }
      setConnectingFrom(null);
    } else {
      setSelectedNode(id);
    }
  };

  // Start connection
  const startConnection = (id, e) => {
    e.stopPropagation();
    setConnectingFrom(id);
  };

  // Delete Node
  const deleteNode = (id, e) => {
    e.stopPropagation();
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  // Trigger Graph Architectural Analysis
  const handleEvaluate = async () => {
    setEvaluating(true);
    setEvaluationResult(null);

    const graphPayload = {
      nodes,
      connections,
      node_count: nodes.length,
      has_cache: nodes.some(n => n.type === 'redis_cache'),
      has_load_balancer: nodes.some(n => n.type === 'load_balancer')
    };

    setTimeout(() => {
      setEvaluating(false);
      const mockScore = Math.min(96, 75 + nodes.length * 3);
      setEvaluationResult({
        architecture_score: mockScore,
        redundancy: 'High (No Single Point of Failure)',
        throughput: 'Estimated 50k QPS',
        insights: [
          'Excellent load balancer decoupling before application microservices.',
          'Redis session cache provides O(1) read latency spikes mitigation.',
          'Consider adding Kafka Event Bus for asynchronous transaction logging.'
        ]
      });

      if (onEvaluateGraph) {
        onEvaluateGraph(graphPayload);
      }
    }, 1200);
  };

  return (
    <div className="rounded-3xl bg-[#0b0f19] border border-slate-800 p-5 shadow-2xl flex flex-col space-y-4">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
              Interactive System Canvas
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {nodes.length} Nodes | {connections.length} Connections
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            Distributed System Architecture Whiteboard
          </h3>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={evaluating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-black text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {evaluating ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
          )}
          <span>Evaluate System Topology</span>
        </button>
      </div>

      {/* Node Palette Toolbox Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-slate-400 font-bold uppercase shrink-0 mr-1">Toolbox:</span>
        {NODE_TYPES.map((type, idx) => {
          const Icon = type.icon;
          return (
            <button
              key={idx}
              onClick={() => addNode(type)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition-all shrink-0 hover:border-indigo-500/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="relative w-full h-[420px] bg-[#070a11] rounded-2xl border border-slate-800 overflow-hidden bg-grid-pattern cursor-crosshair"
      >
        {/* Connection Notice Pill */}
        {connectingFrom && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1 rounded-full text-xs font-mono font-bold z-30 animate-pulse">
            Click another node to connect line...
          </div>
        )}

        {/* SVG Bezier Connection Lines Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((conn, idx) => {
            const sourceNode = nodes.find(n => n.id === conn.from);
            const targetNode = nodes.find(n => n.id === conn.to);
            if (!sourceNode || !targetNode) return null;

            const startX = sourceNode.x + 90;
            const startY = sourceNode.y + 35;
            const endX = targetNode.x + 90;
            const endY = targetNode.y + 35;

            const midX = (startX + endX) / 2;

            return (
              <g key={idx}>
                <path
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  stroke="#6366f1"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx={endX} cy={endY} r="4" fill="#22d3ee" />
              </g>
            );
          })}
        </svg>

        {/* Draggable Architecture Nodes */}
        {nodes.map(node => {
          const typeMeta = NODE_TYPES.find(t => t.type === node.type) || NODE_TYPES[0];
          const Icon = typeMeta.icon;
          const isSelected = selectedNode === node.id;
          const isSource = connectingFrom === node.id;

          return (
            <motion.div
              key={node.id}
              drag
              dragConstraints={canvasRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDrag={(e, info) => handleNodeDrag(node.id, info)}
              onClick={() => handleNodeClick(node.id)}
              style={{ x: node.x, y: node.y }}
              className={`absolute top-0 left-0 w-48 rounded-2xl bg-[#0f172a] border p-3.5 shadow-2xl cursor-grab active:cursor-grabbing z-20 transition-colors ${
                isSource
                  ? 'border-amber-400 shadow-amber-500/20'
                  : isSelected
                  ? 'border-cyan-400 shadow-cyan-500/20'
                  : 'border-slate-800 hover:border-indigo-500/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
                  {typeMeta.badge}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => startConnection(node.id, e)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400"
                    title="Connect Node"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => deleteNode(node.id, e)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400"
                    title="Delete Node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${typeMeta.color} p-[1px] shrink-0`}>
                  <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{node.label}</div>
                  <div className="text-[10px] font-mono text-slate-400">ID: {node.id}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Evaluation Results Card */}
      {evaluationResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 font-sans space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> LangGraph Architecture Evaluation Report
            </span>
            <span className="text-sm font-black text-white">
              Topology Rating: <span className="text-cyan-400">{evaluationResult.architecture_score}/100</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-400 font-medium">Redundancy: </span>
              <span className="text-emerald-400 font-bold">{evaluationResult.redundancy}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-400 font-medium">Capacity: </span>
              <span className="text-cyan-400 font-bold">{evaluationResult.throughput}</span>
            </div>
          </div>

          <ul className="space-y-1 text-xs text-slate-300 pt-1">
            {evaluationResult.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
