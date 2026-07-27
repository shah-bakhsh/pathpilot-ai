/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Network, Plus, Trash2, Play, Sparkles, RefreshCw, Shield, Server, Database, Cpu, Layers, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { MOCK_SYSTEM_DESIGN_DIAGRAMS } from './mockData';
import { SystemDesignDiagram, SystemDesignNode, CompanyName } from './InterviewTypes';
import { AIInterviewService } from '../../../services/aiInterviewService';

export const SystemDesignInterviewView: React.FC = () => {
  const [diagram, setDiagram] = useState<SystemDesignDiagram>(MOCK_SYSTEM_DESIGN_DIAGRAMS[0]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyName>('Google');
  
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const availableNodeTypes: Array<{ type: SystemDesignNode['type']; label: string; icon: any }> = [
    { type: 'client', label: 'Web/Mobile Client', icon: Cpu },
    { type: 'load_balancer', label: 'Load Balancer (NGINX)', icon: Network },
    { type: 'api_gateway', label: 'API Gateway', icon: Layers },
    { type: 'service', label: 'Microservice', icon: Server },
    { type: 'cache', label: 'Redis Cache Cluster', icon: Cpu },
    { type: 'database', label: 'PostgreSQL DB', icon: Database },
    { type: 'queue', label: 'Kafka Event Queue', icon: Layers }
  ];

  const handleAddNode = (typeObj: typeof availableNodeTypes[0]) => {
    const newNode: SystemDesignNode = {
      id: `node_${Date.now()}`,
      type: typeObj.type,
      label: typeObj.label,
      x: 100 + (diagram.nodes.length % 4) * 150,
      y: 100 + Math.floor(diagram.nodes.length / 4) * 100
    };
    setDiagram(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const handleRemoveNode = (nodeId: string) => {
    setDiagram(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    }));
  };

  const handleEvaluateArchitecture = async () => {
    setIsEvaluating(true);
    try {
      const res = await AIInterviewService.evaluateSystemDesign(diagram, selectedCompany);
      setEvalResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Network className="w-3.5 h-3.5 mr-1" /> Interactive System Architecture Canvas
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            System Design & Distributed Systems Studio
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Construct high-throughput system topologies, configure caching & event streaming, and execute AI architectural review for scalability and bottleneck detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleEvaluateArchitecture}
            disabled={isEvaluating}
            className="text-xs font-black h-10 px-5 bg-primary text-black cursor-pointer shadow-md"
          >
            {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
            Evaluate System Architecture
          </Button>
        </div>
      </div>

      {/* Component Toolbar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-text-sub uppercase tracking-wider mr-2">Add Components:</span>
        {availableNodeTypes.map((nt, idx) => (
          <Button
            key={idx}
            variant="outline"
            onClick={() => handleAddNode(nt)}
            className="text-[11px] font-bold h-8 px-3 border-[var(--border)] hover:bg-[var(--surface-secondary)]/20"
          >
            <Plus className="w-3 h-3 text-primary mr-1" /> {nt.label}
          </Button>
        ))}
      </div>

      {/* Main Diagram Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Canvas Area */}
        <Card className="lg:col-span-8 bg-[#090d16] border-[var(--border)] relative overflow-hidden min-h-[420px]">
          <CardHeader className="pb-2 border-b border-[var(--border)]/40 bg-[var(--surface)]/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black text-text-main flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" /> {diagram.title}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {diagram.nodes.length} Components Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
              {diagram.nodes.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  className="p-4 rounded-xl bg-[var(--surface)]/90 border border-primary/30 shadow-lg flex flex-col justify-between gap-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Server className="w-4 h-4" />
                    </div>
                    <button
                      onClick={() => handleRemoveNode(node.id)}
                      className="text-text-mute hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-black text-text-main block">{node.label}</span>
                    <span className="text-[10px] text-text-mute uppercase tracking-wider block mt-0.5">{node.type}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[var(--border)] text-text-sub font-mono">
                    <span>ID: {node.id.slice(0, 8)}</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: System Requirements & AI Analysis */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="bg-[var(--surface)] border-[var(--border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Target SLA & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-xs">
              {diagram.requirements.map((req, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[var(--surface-secondary)]/10 border border-[var(--border)] font-semibold text-text-main flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {req}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Evaluated Architecture Results */}
          {evalResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-[var(--surface)] border border-primary/30 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text-main">Architecture Rating</span>
                <Badge variant="primary" className="text-xs font-black">
                  Score: {evalResult.score}%
                </Badge>
              </div>

              <p className="text-xs text-text-main font-medium leading-relaxed">
                {evalResult.overallFeedback}
              </p>

              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block mb-1">Architectural Strengths</span>
                <ul className="text-[11px] text-text-mute list-disc pl-4 space-y-0.5">
                  {evalResult.strengths?.map((str: string, i: number) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              {evalResult.bottlenecks?.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Potential Bottlenecks
                  </span>
                  <ul className="text-[11px] text-text-mute list-disc pl-4 space-y-0.5">
                    {evalResult.bottlenecks.map((bot: string, i: number) => (
                      <li key={i}>{bot}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
};
