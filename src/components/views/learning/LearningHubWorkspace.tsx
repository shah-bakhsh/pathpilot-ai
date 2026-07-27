/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Layers, Sparkles, GraduationCap, Award,
  Code2, Clock, BarChart3, Plus, BookOpen, X
} from 'lucide-react';
import { useLearning } from '../../../hooks/useLearning';
import { useAuth } from '../../../contexts/useAuth';
import { LearningDashboardView } from './LearningDashboardView';
import { LearningRoadmapView } from './LearningRoadmapView';
import { SkillGapAnalysisView } from './SkillGapAnalysisView';
import { CourseRecommendationsView } from './CourseRecommendationsView';
import { CertificationPlannerView } from './CertificationPlannerView';
import { ProjectLearningView } from './ProjectLearningView';
import { StudyPlannerView } from './StudyPlannerView';
import { LearningAnalyticsView } from './LearningAnalyticsView';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export const LearningHubWorkspace: React.FC = () => {
  const { user, addXp } = useAuth();
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    skillGapAnalysis,
    analyzingSkillGap,
    runSkillGapAnalysis,
    recommendations,
    loadingRecommendations,
    fetchRecommendations,
    certificationReadiness,
    analyzingCertification,
    checkCertificationReadiness,
    generatedSyllabus,
    generatingSyllabus,
    generateSyllabus
  } = useLearning();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    source: 'Coursera',
    hoursTotal: 15,
    hoursCompleted: 0,
    status: 'in_progress' as const,
    scheduleDay: 'Monday' as const,
    priority: 'high' as const,
    url: ''
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    await addCourse(newCourse);
    setIsAddCourseOpen(false);
    setNewCourse({
      title: '',
      source: 'Coursera',
      hoursTotal: 15,
      hoursCompleted: 0,
      status: 'in_progress',
      scheduleDay: 'Monday',
      priority: 'high',
      url: ''
    });
  };

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Layers },
    { id: 'skillgap', label: 'Skill Gap', icon: Sparkles },
    { id: 'recommendations', label: 'Courses', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'planner', label: 'Study Schedule', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col gap-6">
      
      {/* Top Workspace Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 md:p-4 rounded-3xl backdrop-blur-md">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Action Button */}
        <Button
          size="sm"
          onClick={() => setIsAddCourseOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 self-end lg:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Syllabus
        </Button>
      </div>

      {/* Main Tab Content View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && (
            <LearningDashboardView
              courses={courses}
              onNavigateTab={setActiveTab}
              onRunSkillGap={() => {
                setActiveTab('skillgap');
                runSkillGapAnalysis();
              }}
              onAddCourse={() => setIsAddCourseOpen(true)}
              onUpdateCourse={updateCourse}
              addXp={addXp}
              userProfile={user}
            />
          )}

          {activeTab === 'roadmap' && (
            <LearningRoadmapView
              onGenerateSyllabus={generateSyllabus}
              generatingSyllabus={generatingSyllabus}
              generatedSyllabus={generatedSyllabus}
              addXp={addXp}
              targetRole={user?.currentTargetGoal}
            />
          )}

          {activeTab === 'skillgap' && (
            <SkillGapAnalysisView
              skillGapAnalysis={skillGapAnalysis}
              analyzingSkillGap={analyzingSkillGap}
              onRunAnalysis={runSkillGapAnalysis}
              targetRole={user?.currentTargetGoal}
              addXp={addXp}
            />
          )}

          {activeTab === 'recommendations' && (
            <CourseRecommendationsView
              recommendations={recommendations}
              loadingRecommendations={loadingRecommendations}
              onFetchRecommendations={fetchRecommendations}
              onAddCourse={addCourse}
              addXp={addXp}
            />
          )}

          {activeTab === 'certifications' && (
            <CertificationPlannerView
              certificationReadiness={certificationReadiness}
              analyzingCertification={analyzingCertification}
              onCheckReadiness={checkCertificationReadiness}
              addXp={addXp}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectLearningView
              addXp={addXp}
              targetRole={user?.currentTargetGoal}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlannerView
              addXp={addXp}
            />
          )}

          {activeTab === 'analytics' && (
            <LearningAnalyticsView
              courses={courses}
              userProfile={user}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Catalog Syllabus Modal */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddCourseOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-extrabold text-white">Catalog Learning Syllabus</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <Input
                label="Syllabus / Course Title"
                placeholder="e.g., High-Performance Distributed Systems"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Source Provider"
                  placeholder="e.g. Coursera, ByteByteGo"
                  value={newCourse.source}
                  onChange={(e) => setNewCourse({ ...newCourse, source: e.target.value })}
                  className="bg-slate-900 border-slate-800 text-xs text-white"
                />
                <Input
                  label="Total Syllabus Hours"
                  type="number"
                  min={1}
                  value={newCourse.hoursTotal}
                  onChange={(e) => setNewCourse({ ...newCourse, hoursTotal: Number(e.target.value) || 1 })}
                  className="bg-slate-900 border-slate-800 text-xs text-white"
                />
              </div>

              <Input
                label="Resource URL"
                placeholder="https://..."
                value={newCourse.url}
                onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddCourseOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                  Add to Learning Hub
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
