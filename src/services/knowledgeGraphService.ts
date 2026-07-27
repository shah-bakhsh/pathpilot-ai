/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgeNode, KnowledgeEdge } from '../types/agents';

const INITIAL_NODES: KnowledgeNode[] = [
  { id: 'node_role_ai', label: 'Senior AI Engineer', type: 'job_role', category: 'Engineering', importanceScore: 98 },
  { id: 'node_role_frontend', label: 'Staff Frontend Architect', type: 'job_role', category: 'Engineering', importanceScore: 92 },
  { id: 'node_skill_pytorch', label: 'PyTorch & Fine-Tuning', type: 'skill', category: 'AI/ML', importanceScore: 95 },
  { id: 'node_skill_react', label: 'React 18 & TypeScript', type: 'skill', category: 'Frontend', importanceScore: 90 },
  { id: 'node_skill_vector', label: 'Vector DBs (Pinecone / PgVector)', type: 'skill', category: 'Databases', importanceScore: 94 },
  { id: 'node_skill_rag', label: 'RAG Architecture & Embeddings', type: 'skill', category: 'AI/ML', importanceScore: 96 },
  { id: 'node_company_google', label: 'Google DeepMind', type: 'company', category: 'Big Tech', importanceScore: 99 },
  { id: 'node_company_openai', label: 'OpenAI', type: 'company', category: 'AI Research', importanceScore: 99 },
  { id: 'node_company_anthropic', label: 'Anthropic', type: 'company', category: 'AI Research', importanceScore: 97 },
  { id: 'node_uni_stanford', label: 'Stanford University AI Lab', type: 'university', category: 'Academia', importanceScore: 98 },
  { id: 'node_sch_gates', label: 'Gates Cambridge Fellowship', type: 'scholarship', category: 'Academic Fellowship', importanceScore: 95 },
  { id: 'node_proj_copilot', label: 'Autonomous Coding Agent Project', type: 'project', category: 'Portfolio', importanceScore: 93 },
  { id: 'node_path_genai', label: 'Generative AI Specialist Track', type: 'learning_path', category: 'Curriculum', importanceScore: 96 },
];

const INITIAL_EDGES: KnowledgeEdge[] = [
  { id: 'e1', sourceId: 'node_role_ai', targetId: 'node_skill_pytorch', relation: 'requires_skill', weight: 0.95 },
  { id: 'e2', sourceId: 'node_role_ai', targetId: 'node_skill_rag', relation: 'requires_skill', weight: 0.98 },
  { id: 'e3', sourceId: 'node_role_ai', targetId: 'node_skill_vector', relation: 'requires_skill', weight: 0.92 },
  { id: 'e4', sourceId: 'node_company_google', targetId: 'node_role_ai', relation: 'hires_for', weight: 0.99 },
  { id: 'e5', sourceId: 'node_company_openai', targetId: 'node_skill_rag', relation: 'requires_skill', weight: 0.99 },
  { id: 'e6', sourceId: 'node_uni_stanford', targetId: 'node_sch_gates', relation: 'offers_scholarship', weight: 0.90 },
  { id: 'e7', sourceId: 'node_path_genai', targetId: 'node_role_ai', relation: 'prepares_for', weight: 0.96 },
  { id: 'e8', sourceId: 'node_proj_copilot', targetId: 'node_skill_react', relation: 'requires_skill', weight: 0.88 },
  { id: 'e9', sourceId: 'node_proj_copilot', targetId: 'node_skill_vector', relation: 'requires_skill', weight: 0.92 },
];

export class KnowledgeGraphService {
  static getNodes(): KnowledgeNode[] {
    return INITIAL_NODES;
  }

  static getEdges(): KnowledgeEdge[] {
    return INITIAL_EDGES;
  }

  static addNode(node: Omit<KnowledgeNode, 'id'>): KnowledgeNode {
    const newNode: KnowledgeNode = {
      ...node,
      id: `node_${Date.now()}`,
    };
    INITIAL_NODES.push(newNode);
    return newNode;
  }

  static addEdge(edge: Omit<KnowledgeEdge, 'id'>): KnowledgeEdge {
    const newEdge: KnowledgeEdge = {
      ...edge,
      id: `edge_${Date.now()}`,
    };
    INITIAL_EDGES.push(newEdge);
    return newEdge;
  }
}
