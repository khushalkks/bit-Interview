import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Database, Cpu, HardDrive, Shield, Activity, Radio, 
  Layers, ArrowRight, RefreshCw, Zap, CheckCircle2, AlertTriangle, 
  Globe, Box, Network, Gauge
} from 'lucide-react';

const NODES = [
  {
    id: 'gateway',
    name: 'API Gateway & WAF',
    tech: 'Kong / Envoy Proxy',
    status: 'Healthy',
    qps: '45,200 QPS',
    latency: '4ms',
    icon: Shield,
    color: 'from-indigo-500 to-cyan-500',
    borderColor: 'border-indigo-500/40',
    glowColor: 'shadow-indigo-500/20',
    desc: 'Handles TLS termination, JWT verification, Token Bucket rate limiting, and request routing.'
  },
  {
    id: 'auth_service',
    name: 'Auth & Session Pods',
    tech: 'FastAPI / OAuth2',
    status: 'Healthy',
    qps: '12,400 QPS',
    latency: '8ms',
    icon: Server,
    color: 'from-violet-500 to-purple-500',
    borderColor: 'border-violet-500/40',
    glowColor: 'shadow-violet-500/20',
    desc: 'Stateless JWT verification & RBAC policy enforcement across Kubernetes cluster.'
  },
  {
    id: 'ai_engine',
    name: 'AI Adaptive Assessor',
    tech: 'LangGraph & GPT-4o',
    status: 'Processing',
    qps: '850 QPS',
    latency: '180ms',
    icon: Cpu,
    color: 'from-cyan-500 to-emerald-400',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-cyan-500/20',
    desc: 'Real-time LLM evaluation, speech transcription analysis, and adaptive question engine.'
  },
  {
    id: 'event_bus',
    name: 'Distributed Event Bus',
    tech: 'Apache Kafka Cluster',
    status: 'Healthy',
    qps: '88,000 Msg/s',
    latency: '2ms',
    icon: Network,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    desc: '3-Node Kafka cluster handling candidate audio logs, proctoring events, and telemetry streams.'
  },
  {
    id: 'redis_cache',
    name: 'L2 Cache & Lock Store',
    tech: 'Redis Cluster (v7.2)',
    status: 'Healthy',
    qps: '98.4% Hit Rate',
    latency: '1ms',
    icon: HardDrive,
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-500/40',
    glowColor: 'shadow-rose-500/20',
    desc: 'In-memory state cache, active interview session locks, and rate limit counters.'
  },
  {
    id: 'db_shards',
    name: 'Primary Database',
    tech: 'PostgreSQL + PgBouncer',
    status: 'Healthy',
    qps: '3,800 TPS',
    latency: '12ms',
    icon: Database,
    color: 'from-emerald-500 to-teal-400',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-emerald-500/20',
    desc: 'Primary ACID database storing user profiles, historical scorecards, and ATS matches.'
  }
];

export default function SystemArchitectureVisualizer() {
  const [selectedNode, setSelectedNode] = useState(NODES[0]);
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    qps: 45280,
    p99: 18.4,
    cacheHit: 98.6,
    activePods: 24
  });

  // Dynamic live metric fluctuation for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMetrics({
        qps: 45000 + Math.floor(Math.random() * 800),
        p99: +(18.0 + Math.random() * 1.5).toFixed(1),
        cacheHit: +(98.4 + Math.random() * 0.4).toFixed(1),
        activePods: 24
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-2xl space-y-6 font-sans">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Production Microservice Topology</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            High-Availability System Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-world distributed infrastructure simulation driving Bit-Interview platform
          </p>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900">
            <span className="text-slate-500">QPS:</span>
            <span className="text-cyan-400 font-bold">{simulatedMetrics.qps.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900">
            <span className="text-slate-500">p99:</span>
            <span className="text-indigo-400 font-bold">{simulatedMetrics.p99}ms</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900">
            <span className="text-slate-500">Cache Hit:</span>
            <span className="text-emerald-400 font-bold">{simulatedMetrics.cacheHit}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900">
            <span className="text-slate-500">K8s Pods:</span>
            <span className="text-violet-400 font-bold">{simulatedMetrics.activePods} Active</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Topology Node Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <span>Interactive Node Topology Map (Click Node to Inspect)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {NODES.map((node) => {
              const IconComp = node.icon;
              const isSelected = selectedNode.id === node.id;

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `bg-slate-950/90 ${node.borderColor} shadow-xl ${node.glowColor} ring-1 ring-indigo-500/50`
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Subtle top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${node.color}`} />

                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${node.color} p-[1px]`}>
                      <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-white">
                        <IconComp className="w-4.5 h-4.5 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {node.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">{node.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{node.tech}</p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-400">{node.qps}</span>
                    <span className="text-indigo-400 font-bold">{node.latency}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Node Detail & System Architecture Probe Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Architecture Node Inspector</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedNode.color} p-[1px]`}>
                  <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-white">
                    <selectedNode.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                  <span className="text-xs font-mono text-indigo-400">{selectedNode.tech}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {selectedNode.desc}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Throughput:</span>
                  <span className="font-mono text-white font-bold">{selectedNode.qps}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Avg Overhead:</span>
                  <span className="font-mono text-indigo-400 font-bold">{selectedNode.latency}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Health Check:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Uptime
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
                <span className="font-bold block text-white flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  FAANG System Design Probe Question:
                </span>
                <p className="italic text-slate-300">
                  "If this {selectedNode.name} component experiences a 10x burst traffic spike, how would you design circuit breakers & cache eviction to prevent cascading failures?"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
