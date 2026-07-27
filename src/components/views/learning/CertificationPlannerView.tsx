/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award, ShieldCheck, CheckCircle2, Clock, Calendar, AlertTriangle,
  ExternalLink, Sparkles, RefreshCw, Check, X, HelpCircle, ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface CertificationPlannerViewProps {
  certificationReadiness: any;
  analyzingCertification: boolean;
  onCheckReadiness: (title: string) => void;
  addXp: (amount: number) => void;
}

export const CertificationPlannerView: React.FC<CertificationPlannerViewProps> = ({
  certificationReadiness,
  analyzingCertification,
  onCheckReadiness,
  addXp
}) => {
  const [selectedCert, setSelectedCert] = useState('Google Cloud Certified Professional Cloud Architect');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const certCatalog = [
    { title: 'Google Cloud Certified Professional Cloud Architect', issuer: 'Google Cloud', cost: '$200', validity: '2 Years' },
    { title: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', cost: '$150', validity: '3 Years' },
    { title: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF / Linux Foundation', cost: '$395', validity: '3 Years' },
    { title: 'Meta Professional Front-End Engineer', issuer: 'Meta', cost: '$49/mo', validity: 'Lifetime' },
    { title: 'CompTIA Security+ (SY0-701)', issuer: 'CompTIA', cost: '$392', validity: '3 Years' }
  ];

  const data = certificationReadiness || {
    readinessScore: 74,
    passingThreshold: 70,
    status: 'Exam Ready with Refinement',
    estimatedDaysToExam: 21,
    voucherCost: '$200 USD',
    validityYears: '2 Years',
    officialUrl: 'https://cloud.google.com/certification',
    domains: [
      { domainName: 'Designing Cloud Architecture', weightPercent: 25, userMasteryPercent: 82, status: 'Mastered' },
      { domainName: 'Managing Infrastructure & Operations', weightPercent: 20, userMasteryPercent: 75, status: 'Proficient' },
      { domainName: 'Designing for Security & Compliance', weightPercent: 20, userMasteryPercent: 68, status: 'Needs Review' },
      { domainName: 'Analyzing & Optimizing Business Processes', weightPercent: 15, userMasteryPercent: 80, status: 'Mastered' },
      { domainName: 'Reliability & High Availability Engineering', weightPercent: 20, userMasteryPercent: 65, status: 'Needs Review' }
    ],
    practiceQuestions: [
      {
        id: 'pq_1',
        question: 'Which Google Cloud service provides auto-scaling serverless container execution with pay-per-use billing down to zero instances?',
        options: ['Google Cloud Compute Engine', 'Google Cloud Run', 'Google Cloud Functions', 'Google Kubernetes Engine'],
        correctIndex: 1,
        explanation: 'Google Cloud Run runs stateless containers directly without managing underlying clusters or nodes, scaling down to zero when idle.'
      },
      {
        id: 'pq_2',
        question: 'When configuring multi-region database replication on Google Cloud Spanner, what mechanism guarantees external consistency across global nodes?',
        options: ['Eventual Consistency Gossip Protocol', 'TrueTime API with Atomic Clocks & GPS', 'Two-Phase Commit Locking only', 'Asynchronous WAL Log Shipping'],
        correctIndex: 1,
        explanation: 'Cloud Spanner uses Google\'s TrueTime API (atomic clocks + GPS receivers) to synchronize time bounds globally and achieve strict serializability.'
      }
    ],
    topStudyTips: [
      'Complete Google Qwiklabs hands-on scenario drills for IAM security policies.',
      'Review Cloud Run environment variable injection and secret manager integration.',
      'Practice 50 official practice exam questions under timed conditions.'
    ]
  };

  const handleSelectCert = (title: string) => {
    setSelectedCert(title);
    onCheckReadiness(title);
  };

  const handleOptionSubmit = (idx: number) => {
    setSelectedOption(idx);
    setShowAnswer(true);
    if (idx === data.practiceQuestions[activeQuestionIdx].correctIndex) {
      addXp(25);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < data.practiceQuestions.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const currentQ = data.practiceQuestions[activeQuestionIdx];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
              Certification Exam Planner & Readiness
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Industry Certification Matrix
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track exam readiness, domain weightings, voucher costs, and practice timed question drills.
          </p>
        </div>

        <Button
          onClick={() => onCheckReadiness(selectedCert)}
          disabled={analyzingCertification}
          className="flex items-center gap-2 shadow-lg shadow-amber-500/20 bg-amber-600 hover:bg-amber-500 text-white"
        >
          {analyzingCertification ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Check Exam Readiness
        </Button>
      </div>

      {/* Certification Catalog Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {certCatalog.map((cert) => (
          <button
            key={cert.title}
            onClick={() => handleSelectCert(cert.title)}
            className={`p-4 rounded-2xl border transition shrink-0 w-64 text-left ${
              selectedCert === cert.title
                ? 'bg-amber-950/20 border-amber-500/50 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">{cert.issuer}</span>
            <h4 className="text-xs font-bold leading-snug line-clamp-2">{cert.title}</h4>
            <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-semibold">
              <span>{cert.cost}</span>
              <span>Validity: {cert.validity}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Readiness Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Readiness Gauge & Domains */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Readiness Summary Card */}
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> {selectedCert}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Exam Readiness Evaluation & Domain Breakdown
                </CardDescription>
              </div>
              <a
                href={data.officialUrl || 'https://google.com'}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Official Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500 flex items-center justify-center font-black text-xl text-amber-400 shrink-0">
                    {data.readinessScore}%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Exam Readiness Score</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{data.status}</h4>
                    <span className="text-[11px] text-emerald-400 font-semibold">Passing Threshold: {data.passingThreshold}%</span>
                  </div>
                </div>

                <div className="text-right sm:border-l border-slate-800 sm:pl-6">
                  <span className="text-xs font-bold text-slate-400 block">Target Exam Date</span>
                  <span className="text-sm font-extrabold text-white mt-0.5 block">~{data.estimatedDaysToExam} Days Away</span>
                  <span className="text-[11px] text-slate-400">Voucher Cost: {data.voucherCost}</span>
                </div>
              </div>

              {/* Domain Breakdown List */}
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3">Exam Domain Breakdown</h4>
              <div className="flex flex-col gap-3">
                {data.domains?.map((dom: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-white">{dom.domainName} <span className="text-slate-500 text-[10px]">({dom.weightPercent}% exam weight)</span></span>
                      <span className={dom.userMasteryPercent >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{dom.userMasteryPercent}% Mastery</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dom.userMasteryPercent >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${dom.userMasteryPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timed Practice Questions Drill */}
        <div className="flex flex-col gap-6">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Exam Question Drill
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Practice question {activeQuestionIdx + 1} of {data.practiceQuestions?.length || 2}
              </CardDescription>
            </CardHeader>

            {currentQ && (
              <CardContent className="flex flex-col gap-4">
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                  {currentQ.question}
                </p>

                <div className="flex flex-col gap-2">
                  {currentQ.options?.map((opt: string, oIdx: number) => {
                    const isCorrect = oIdx === currentQ.correctIndex;
                    const isSelected = selectedOption === oIdx;

                    let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (showAnswer) {
                      if (isCorrect) btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
                      else if (isSelected) btnStyle = 'bg-rose-950/40 border-rose-500/50 text-rose-300';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={showAnswer}
                        onClick={() => handleOptionSubmit(oIdx)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showAnswer && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                        {showAnswer && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {showAnswer && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs leading-relaxed text-slate-300">
                    <span className="font-bold text-emerald-400 block mb-1">Explanation:</span>
                    {currentQ.explanation}
                  </div>
                )}

                {showAnswer && activeQuestionIdx < (data.practiceQuestions?.length - 1) && (
                  <Button size="sm" onClick={handleNextQuestion} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold">
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            )}
          </Card>

          {/* Top Study Tips Card */}
          <Card className="bg-amber-950/10 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Top Exam Study Tips</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {data.topStudyTips?.map((tip: string, tIdx: number) => (
                <div key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
