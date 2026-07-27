/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, Play, CheckCircle2, XCircle, Sparkles, RefreshCw, HelpCircle, Terminal, Cpu, Clock, Award
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Textarea } from '../../ui/Input';
import { MOCK_CODING_PROBLEMS } from './mockData';
import { CodingProblem } from './InterviewTypes';
import { AIInterviewService } from '../../../services/aiInterviewService';

export const CodingInterviewView: React.FC = () => {
  const [selectedProblemIdx, setSelectedProblemIdx] = useState<number>(0);
  const [language, setLanguage] = useState<'typescript' | 'python'>('typescript');
  
  const currentProblem: CodingProblem = MOCK_CODING_PROBLEMS[selectedProblemIdx] || MOCK_CODING_PROBLEMS[0];
  
  const [userCode, setUserCode] = useState<string>(
    currentProblem.starterCode[language] || ''
  );

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleLanguageChange = (lang: 'typescript' | 'python') => {
    setLanguage(lang);
    setUserCode(currentProblem.starterCode[lang] || '');
    setEvaluationResult(null);
  };

  const handleProblemChange = (idx: number) => {
    setSelectedProblemIdx(idx);
    const p = MOCK_CODING_PROBLEMS[idx];
    if (p) {
      setUserCode(p.starterCode[language] || '');
    }
    setEvaluationResult(null);
    setShowHint(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await AIInterviewService.evaluateCodeSubmission(currentProblem, userCode, language);
      setEvaluationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <Code2 className="w-3.5 h-3.5 mr-1" /> Live Coding & Algorithm Studio
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Interactive Technical Coding Environment
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Solve algorithmic challenges, write code in the interactive scratchpad, run test cases, and receive instant asymptotic complexity analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {MOCK_CODING_PROBLEMS.map((prob, idx) => (
            <button
              key={prob.id}
              onClick={() => handleProblemChange(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${selectedProblemIdx === idx ? 'bg-primary text-black' : 'bg-[var(--surface-secondary)]/20 border border-[var(--border)] text-text-sub'}`}
            >
              Problem #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left Problem Statement, Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Details */}
        <Card className="lg:col-span-5 bg-[var(--surface)] border-[var(--border)] flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" /> {currentProblem.title}
              </CardTitle>
              <Badge variant="primary" className="text-[10px] font-extrabold">
                {currentProblem.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-xs text-text-mute mt-1">
              Target Companies: {currentProblem.companies.join(', ')}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface-secondary)]/10 border border-[var(--border)] text-text-main leading-relaxed">
              {currentProblem.description}
            </div>

            {/* Test Cases */}
            <div>
              <span className="font-black text-text-sub uppercase tracking-wider block mb-2 text-[10px]">
                Sample Input / Output Constraints
              </span>
              <div className="flex flex-col gap-2">
                {currentProblem.testCases.map((tc, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[var(--surface-secondary)]/20 border border-[var(--border)] font-mono text-[11px]">
                    <div className="text-text-sub"><span className="font-bold text-primary">Input:</span> {tc.input}</div>
                    <div className="text-text-main mt-0.5"><span className="font-bold text-emerald-400">Output:</span> {tc.expectedOutput}</div>
                    {tc.explanation && (
                      <div className="text-[10px] text-text-mute font-sans mt-1">{tc.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity Targets */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[var(--surface-secondary)]/10 border border-[var(--border)]">
                <span className="text-text-mute font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> Expected Time</span>
                <span className="font-black text-text-main mt-0.5 block">{currentProblem.timeComplexity}</span>
              </div>
              <div className="p-2 rounded bg-[var(--surface-secondary)]/10 border border-[var(--border)]">
                <span className="text-text-mute font-bold flex items-center gap-1"><Cpu className="w-3 h-3 text-indigo-400" /> Expected Space</span>
                <span className="font-black text-text-main mt-0.5 block">{currentProblem.spaceComplexity}</span>
              </div>
            </div>

            {/* Hint Dropdown */}
            <div>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] font-bold h-7 px-2.5"
              >
                <HelpCircle className="w-3 h-3 mr-1" /> {showHint ? 'Hide Hint' : 'Show AI Algorithmic Hint'}
              </Button>
              {showHint && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-text-main mt-2">
                  💡 {currentProblem.hints[0]}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Code Editor & Scratchpad */}
        <Card className="lg:col-span-7 bg-[var(--surface)] border-[var(--border)] flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-black">Interactive Editor</CardTitle>
                <div className="flex items-center gap-1 bg-[var(--surface-secondary)]/20 p-1 rounded-lg border border-[var(--border)]">
                  <button
                    onClick={() => handleLanguageChange('typescript')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${language === 'typescript' ? 'bg-primary text-black' : 'text-text-sub'}`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => handleLanguageChange('python')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${language === 'python' ? 'bg-primary text-black' : 'text-text-sub'}`}
                  >
                    Python
                  </button>
                </div>
              </div>
              <Button
                onClick={handleRunCode}
                disabled={isRunning || !userCode.trim()}
                className="text-xs font-black h-8 px-4 bg-primary text-black cursor-pointer"
              >
                {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <Play className="w-3.5 h-3.5 fill-black mr-1" />}
                Run & Evaluate
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {/* Code Textarea */}
            <Textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              rows={14}
              className="font-mono text-xs bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl border border-[var(--border)] focus:ring-1 focus:ring-primary leading-relaxed"
            />

            {/* Test Results Output */}
            {evaluationResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-[var(--surface-secondary)]/10 border border-[var(--border)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text-main flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Code Evaluation Score: {evaluationResult.score}%
                  </span>
                  <Badge variant={evaluationResult.passed ? 'success' : 'outline'} className="text-xs font-black">
                    {evaluationResult.passed ? 'All Tests Passed' : 'Needs Optimization'}
                  </Badge>
                </div>

                <p className="text-xs text-text-mute">{evaluationResult.feedback}</p>

                <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-[var(--border)]">
                  <span><strong>Time Complexity:</strong> {evaluationResult.timeComplexity}</span>
                  <span><strong>Space Complexity:</strong> {evaluationResult.spaceComplexity}</span>
                </div>

                {evaluationResult.testResults && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {evaluationResult.testResults.map((tr: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded bg-[var(--surface)] border border-[var(--border)]">
                        <span className="font-bold flex items-center gap-1.5 text-text-main">
                          {tr.status === 'PASSED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          {tr.name}
                        </span>
                        <span className="text-text-mute font-mono">{tr.details}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
