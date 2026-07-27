/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock, Play, Pause, RotateCcw, Volume2, Calendar,
  CheckCircle2, Plus, Sparkles, Award, Bell
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface StudyPlannerViewProps {
  addXp: (amount: number) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({ addXp }) => {
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 min pomodoro
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('System Design & Redis Caching');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      addXp(50);
      alert('Pomodoro study block completed! +50 XP awarded!');
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, addXp]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(25 * 60);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const scheduleDays = [
    { day: 'Monday', topic: 'Redis Caching & Mutex Locks', duration: '1.5 Hrs', status: 'Completed' },
    { day: 'Tuesday', topic: 'Google Cloud Run Deployments', duration: '1.0 Hr', status: 'In Progress' },
    { day: 'Wednesday', topic: 'PostgreSQL Query Optimization', duration: '2.0 Hrs', status: 'Upcoming' },
    { day: 'Thursday', topic: 'TypeScript Advanced Types', duration: '1.0 Hr', status: 'Upcoming' },
    { day: 'Friday', topic: 'LeetCode Medium Algorithms', duration: '1.5 Hrs', status: 'Upcoming' },
    { day: 'Saturday', topic: 'System Design Capstone Build', duration: '3.0 Hrs', status: 'Upcoming' },
    { day: 'Sunday', topic: 'Weekly Review & Certification Drill', duration: '1.0 Hr', status: 'Upcoming' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
              Daily Focus & Weekly Schedule
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Study Planner & Pomodoro Timer
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Maintain deep focus study sessions, log daily hours, and follow a balanced weekly study schedule.
          </p>
        </div>
      </div>

      {/* Main Grid: Pomodoro Timer & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Pomodoro Focus Timer */}
        <Card className="bg-slate-900/30 border-slate-800 flex flex-col justify-between">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" /> Deep Focus Session
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              25-Minute Structured Pomodoro Focus Block
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-56 h-56 rounded-full bg-slate-950 border-4 border-purple-500/30 flex items-center justify-center shadow-2xl shadow-purple-500/10 mb-6">
              <div className="text-center">
                <span className="text-5xl font-black text-white font-mono tracking-wider block">
                  {formattedTime}
                </span>
                <span className="text-xs font-bold text-purple-400 mt-2 block">{sessionTopic}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={toggleTimer}
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'
                } text-white`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause Focus' : 'Start Focus'}
              </Button>
              <Button
                variant="outline"
                onClick={resetTimer}
                className="p-2.5 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-2xl"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right 2 Columns: Weekly Schedule List */}
        <Card className="bg-slate-900/30 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" /> Weekly Study Schedule
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Allocated study targets by day to maximize consistency and prevent burnout.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {scheduleDays.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-24 text-xs font-extrabold text-purple-400">{item.day}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.topic}</span>
                    <span className="text-[10px] text-slate-400">{item.duration} planned</span>
                  </div>
                </div>

                <Badge
                  className={
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                      : item.status === 'In Progress'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]'
                      : 'bg-slate-800 text-slate-400 text-[10px]'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
