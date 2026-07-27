/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResumeAnalysis, ChatMessage, CareerRoadmap } from '../types';

/**
 * Client-side interface to our secure full-stack AI endpoints.
 * This ensures no API keys are exposed to the browser.
 */
export class GeminiService {
  /**
   * Dispatches parsed resume text and target coordinates to our backend for structural diagnostic.
   */
  static async analyzeResume(resumeText: string, targetRole: string): Promise<ResumeAnalysis> {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, targetRole }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to analyze resume details.');
    }

    return response.json();
  }

  /**
   * Forwards chat histories to the secure backend for streaming or standard chat replies.
   */
  static async getCoachReply(
    messageText: string,
    history: ChatMessage[],
    targetRole: string
  ): Promise<string> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageText, history, targetRole }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to retrieve AI coach reply.');
    }

    const data = await response.json();
    return data.text;
  }

  /**
   * Solicits a structured milestone roadmapping grid from the backend.
   */
  static async generateRoadmap(resumeAnalysis: ResumeAnalysis, targetRole: string): Promise<CareerRoadmap> {
    const response = await fetch('/api/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeAnalysis, targetRole }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate trajectory roadmap.');
    }

    return response.json();
  }
}

export default GeminiService;
