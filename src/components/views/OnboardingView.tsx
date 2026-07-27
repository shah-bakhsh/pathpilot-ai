/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PathPilotLogo } from '../ui/PathPilotLogo';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  User,
  Globe,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
  Sparkles,
  Cpu,
  Plus,
  X,
  Award,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Brain,
  Layers,
  ChevronRight,
  Code,
  AlertCircle
} from 'lucide-react';

const PREDEFINED_GOALS = [
  'AI Solutions Engineer',
  'Machine Learning Engineer',
  'Software Engineer - Backend',
  'Software Engineer - Frontend',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Cloud Architect',
  'Technical Product Manager',
  'UI/UX Product Designer',
  'DevOps Engineer'
];

const PREDEFINED_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL',
  'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS',
  'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS',
  'Git', 'GitHub', 'Firebase', 'GraphQL', 'System Design'
];

const PREDEFINED_LANGUAGES = ['English', 'Spanish', 'Mandarin', 'German', 'French', 'Hindi', 'Arabic'];

export const OnboardingView: React.FC = () => {
  const { user, updateOnboardingData, completeOnboarding } = useAuth();
  
  // Active step (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Step 1: General Info
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [preferredLang, setPreferredLang] = useState<string>('English');
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  // Step 2: Path Selection (Student vs Professional)
  const [userRole, setUserRole] = useState<'student' | 'professional'>('student');
  // Student fields
  const [university, setUniversity] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [currentSemester, setCurrentSemester] = useState<string>('Semester 5');
  const [graduationYear, setGraduationYear] = useState<string>('2027');
  // Professional fields
  const [currentJob, setCurrentJob] = useState<string>('');
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [yearsExp, setYearsExp] = useState<number>(0);

  // Step 3: Career Goals Selection
  const [selectedGoals, setSelectedGoals] = useState<string[]>([user?.currentTargetGoal || 'Software Engineer - Backend']);
  const [customGoal, setCustomGoal] = useState<string>('');

  // Step 4: Skills Assessment
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState<string>('');

  // Step 5: Experience Metrics
  const [projectsCount, setProjectsCount] = useState<number>(2);
  const [hackathonsCount, setHackathonsCount] = useState<number>(0);
  const [internshipsCount, setInternshipsCount] = useState<number>(0);
  const [isOpenSourceContributor, setIsOpenSourceContributor] = useState<boolean>(false);
  const [isResearchCompleted, setIsResearchCompleted] = useState<boolean>(false);
  const [certificationsInput, setCertificationsInput] = useState<string>('');
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>(['English']);

  // Step 6: Resume Upload Simulation
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Step 8: Complete Simulator Loading
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Adding Custom Career Target
  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      setSelectedGoals([...selectedGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  // Toggling Goals
  const handleToggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  // Toggling Skills
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Adding Custom Skill
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0]);
    }
  };

  const simulateFileUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('PathPilot simulator requires high-density PDF resume files only.');
      return;
    }
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setResumeFile({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
          });
          setIsUploading(false);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // On Step Navigation Next
  const handleNextStep = async () => {
    setErrorMessage(null);
    // Collect and save to auth context
    const partialData: any = {};
    
    if (currentStep === 1) {
      if (!fullName.trim() || !country.trim() || !city.trim()) {
        setErrorMessage('Please specify your profile parameters to calibrate path coordinates.');
        return;
      }
      partialData.country = country;
      partialData.city = city;
      partialData.preferredLanguage = preferredLang;
      partialData.timezone = timezone;
    } else if (currentStep === 2) {
      if (userRole === 'student') {
        partialData.university = university;
        partialData.degree = degree;
        partialData.currentSemester = currentSemester;
        partialData.graduationYear = graduationYear;
      } else {
        partialData.currentJob = currentJob;
        partialData.currentCompany = currentCompany;
        partialData.graduationYear = `${yearsExp} Years Exp`;
      }
    } else if (currentStep === 3) {
      if (selectedGoals.length === 0) {
        setErrorMessage('Select at least one career target goal.');
        return;
      }
      partialData.careerGoals = selectedGoals;
    } else if (currentStep === 4) {
      partialData.selectedSkills = selectedSkills;
    } else if (currentStep === 5) {
      partialData.experienceSummary = {
        projectsCompleted: projectsCount,
        hackathons: hackathonsCount,
        internships: internshipsCount,
        workExperienceYears: userRole === 'professional' ? yearsExp : 0,
        openSourceContribution: isOpenSourceContributor,
        researchCompleted: isResearchCompleted
      };
    } else if (currentStep === 6) {
      if (resumeFile) {
        partialData.resumeMetadata = {
          name: resumeFile.name,
          size: parseFloat(resumeFile.size),
          uploadedAt: new Date().toISOString()
        };
      }
    }

    await updateOnboardingData(partialData);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Final confirmation to launch
  const handleFinalizeLaunch = async () => {
    setIsFinalizing(true);
    
    // Smooth 2.5 second immersive loading simulation
    setTimeout(async () => {
      await completeOnboarding();
      setIsFinalizing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 relative overflow-hidden select-none">
      
      {/* Premium ambient decorative nodes */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-modal shadow-2xl relative overflow-hidden flex flex-col min-h-[580px] z-10 animate-fade-in">
        
        {/* Step Progress bar header (Section 3) */}
        <div className="w-full h-1.5 bg-[var(--border)]/40 relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content canvas wrapper */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          
          {/* Header Metadata */}
          <div className="flex items-center justify-between mb-6 shrink-0 border-b border-[var(--border)]/65 pb-4">
            <div className="flex items-center gap-2">
              <PathPilotLogo size={18} />
              <span className="text-[10px] font-mono font-bold tracking-wider text-text-mute uppercase">Trajectory Calibration</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--hover-tint)] px-2.5 py-1 rounded-full border border-[var(--border)]/75">
              <span className="text-[10px] font-mono font-bold text-text-sub">Step {currentStep} of {totalSteps}</span>
            </div>
          </div>

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center justify-between gap-2.5 p-3.5 rounded-card bg-error/5 border border-error/10 text-xs font-semibold text-error leading-relaxed"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-error" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-error/10 rounded cursor-pointer transition-colors text-error">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          <div className="flex-1 flex flex-col gap-5 justify-center">
            
            {/* STEP 1: General Coordinates */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main flex items-center gap-2">
                    Let's align your core coordinates <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                  </h2>
                  <p className="text-xs text-text-mute font-medium">Configure your profile details to calibrating localized market parameters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <Input 
                    label="Full Identification Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Mercer"
                    required
                    leftIcon={<User className="w-4 h-4 text-text-mute" />}
                  />
                  <Input 
                    label="Current Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    required
                    leftIcon={<Globe className="w-4 h-4 text-text-mute" />}
                  />
                  <Input 
                    label="Current City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    required
                    leftIcon={<MapPin className="w-4 h-4 text-text-mute" />}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-sub">Preferred Trajectory Language</label>
                    <select 
                      value={preferredLang} 
                      onChange={(e) => setPreferredLang(e.target.value)}
                      className="w-full bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] px-3.5 h-10 transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 appearance-none font-semibold cursor-pointer"
                    >
                      {PREDEFINED_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Education / Professional */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main">Your Current Workspace Status</h2>
                  <p className="text-xs text-text-mute font-medium">Are you preparing to break in as a student or polishing skills as a working practitioner?</p>
                </div>

                {/* Status Toggle Switch */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-[var(--hover-tint)] rounded-btn mt-2 border border-[var(--border)]/75">
                  <button
                    onClick={() => setUserRole('student')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-btn transition-all duration-150 cursor-pointer ${
                      userRole === 'student' ? 'bg-[var(--surface)] text-primary shadow-sm border border-[var(--border)]/60' : 'text-text-mute'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> Student Trajectory
                  </button>
                  <button
                    onClick={() => setUserRole('professional')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-btn transition-all duration-150 cursor-pointer ${
                      userRole === 'professional' ? 'bg-[var(--surface)] text-primary shadow-sm border border-[var(--border)]/60' : 'text-text-mute'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Professional Path
                  </button>
                </div>

                {/* Form conditional fields */}
                <AnimatePresence mode="wait">
                  {userRole === 'student' ? (
                    <motion.div 
                      key="student-fields"
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                    >
                      <Input 
                        label="University / Academy"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="Stanford University"
                        required
                        leftIcon={<GraduationCap className="w-4 h-4 text-text-mute" />}
                      />
                      <Input 
                        label="Field of Study / Degree"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="B.S. Computer Science"
                        required
                        leftIcon={<Award className="w-4 h-4 text-text-mute" />}
                      />
                      <Input 
                        label="Current Semester / Level"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(e.target.value)}
                        placeholder="Semester 6"
                        required
                        leftIcon={<Clock className="w-4 h-4 text-text-mute" />}
                      />
                      <Input 
                        label="Expected Graduation Year"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="2027"
                        required
                        leftIcon={<Settings className="w-4 h-4 text-text-mute" />}
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="professional-fields"
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                    >
                      <Input 
                        label="Current Job Title"
                        value={currentJob}
                        onChange={(e) => setCurrentJob(e.target.value)}
                        placeholder="Software Engineer"
                        required
                        leftIcon={<Briefcase className="w-4 h-4 text-text-mute" />}
                      />
                      <Input 
                        label="Current Company / Firm"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="Stripe"
                        required
                        leftIcon={<Layers className="w-4 h-4 text-text-mute" />}
                      />
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-text-sub">Years of Experience</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="15" 
                            value={yearsExp} 
                            onChange={(e) => setYearsExp(parseInt(e.target.value))}
                            className="flex-1 accent-primary h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm font-mono font-bold text-primary w-12 text-right">{yearsExp} Year{yearsExp !== 1 && 's'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* STEP 3: Career Goal Selection */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main flex items-center gap-2">
                    Select Your Destination Paths
                  </h2>
                  <p className="text-xs text-text-mute font-medium">Pick one or more trajectory targets. The AI model compiles gaps against these criteria.</p>
                </div>

                {/* Predefined Grid (multi-select) */}
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PREDEFINED_GOALS.map(goal => {
                    const active = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => handleToggleGoal(goal)}
                        className={`p-2.5 text-left rounded-btn border text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                          active 
                            ? 'bg-primary/8 border-primary text-primary' 
                            : 'border-[var(--border)] hover:bg-[var(--hover-tint)] text-text-sub'
                        }`}
                      >
                        <span>{goal}</span>
                        {active && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Goal Input */}
                <form onSubmit={handleAddCustomGoal} className="flex gap-2 items-end mt-2">
                  <div className="flex-1">
                    <Input 
                      label="Add Custom Destination Path"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="e.g. Distributed Database Architect"
                      leftIcon={<Target className="w-4 h-4 text-text-mute" />}
                    />
                  </div>
                  <Button type="submit" variant="outline" className="h-10 px-3 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-primary" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Current Skills Assessment */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main">Inventory Your Stack</h2>
                  <p className="text-xs text-text-mute font-medium">Select skills you currently possess. PathPilot isolates remaining gaps to build roadmaps.</p>
                </div>

                {/* Skills wrap panel */}
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto border border-[var(--border)]/70 p-2.5 rounded-btn bg-[var(--surface)]">
                  {PREDEFINED_SKILLS.map(skill => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-secondary/10 border-secondary text-secondary'
                            : 'border-[var(--border)]/75 hover:bg-[var(--hover-tint)] text-text-mute'
                        }`}
                      >
                        {skill}
                        {active && <CheckCircle className="w-3 h-3 text-secondary" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill form */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 items-end mt-1">
                  <div className="flex-1">
                    <Input 
                      label="Custom Technology or Skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="e.g. Redis, GoLang, Jenkins"
                      leftIcon={<Code className="w-4 h-4 text-text-mute" />}
                    />
                  </div>
                  <Button type="submit" variant="outline" className="h-10 px-3 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-secondary" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 5: Experience Metrics Assessment */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main">Project & Hackathon Velocity</h2>
                  <p className="text-xs text-text-mute font-medium">Share your practical background statistics to tune simulator difficulty.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[var(--hover-tint)]/40 border border-[var(--border)]/75 rounded-card flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase text-center">Projects Done</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setProjectsCount(Math.max(0, projectsCount - 1))}>-</Button>
                      <span className="text-sm font-mono font-bold text-primary">{projectsCount}</span>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setProjectsCount(projectsCount + 1)}>+</Button>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--hover-tint)]/40 border border-[var(--border)]/75 rounded-card flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase text-center">Hackathons</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setHackathonsCount(Math.max(0, hackathonsCount - 1))}>-</Button>
                      <span className="text-sm font-mono font-bold text-secondary">{hackathonsCount}</span>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setHackathonsCount(hackathonsCount + 1)}>+</Button>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--hover-tint)]/40 border border-[var(--border)]/75 rounded-card flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase text-center">Internships</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setInternshipsCount(Math.max(0, internshipsCount - 1))}>-</Button>
                      <span className="text-sm font-mono font-bold text-accent">{internshipsCount}</span>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setInternshipsCount(internshipsCount + 1)}>+</Button>
                    </div>
                  </div>
                </div>

                {/* Fast binary switches */}
                <div className="grid grid-cols-2 gap-3.5 mt-2">
                  <button
                    onClick={() => setIsOpenSourceContributor(!isOpenSourceContributor)}
                    className={`p-3 border rounded-btn text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                      isOpenSourceContributor ? 'bg-primary/8 border-primary text-primary' : 'border-[var(--border)] text-text-sub'
                    }`}
                  >
                    <span>Open-Source Contributor</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isOpenSourceContributor ? 'border-primary bg-primary' : 'border-[var(--border)]'}`}>
                      {isOpenSourceContributor && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setIsResearchCompleted(!isResearchCompleted)}
                    className={`p-3 border rounded-btn text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                      isResearchCompleted ? 'bg-primary/8 border-primary text-primary' : 'border-[var(--border)] text-text-sub'
                    }`}
                  >
                    <span>Scientific Research Done</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isResearchCompleted ? 'border-primary bg-primary' : 'border-[var(--border)]'}`}>
                      {isResearchCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Resume Upload Simulation */}
            {currentStep === 6 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main flex items-center gap-2">
                    Calibrate Alignment with Resume
                  </h2>
                  <p className="text-xs text-text-mute font-medium">Upload your PDF resume. The AI parsing model extracts keyword metrics instantly (Secure & Private).</p>
                </div>

                {/* Drag zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('onboarding-resume-picker')?.click()}
                  className={`border-2 border-dashed rounded-modal p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-primary bg-primary/5 scale-[0.99]' 
                      : 'border-[var(--border)]/70 hover:border-primary/45 hover:bg-[var(--hover-tint)]/25'
                  }`}
                >
                  <input 
                    type="file" 
                    id="onboarding-resume-picker" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                      <Cpu className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-[11px] font-mono font-bold text-text-mute uppercase tracking-widest">Parsing Structure: {uploadProgress}%</span>
                      <div className="w-full bg-[var(--border)]/60 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : resumeFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                        <CheckCircle className="w-5.5 h-5.5" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-text-main line-clamp-1">{resumeFile.name}</p>
                        <p className="text-[10px] text-text-mute mt-0.5">{resumeFile.size}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-error font-bold text-[10px] h-7"
                        onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                      >
                        Reset File Coordinates
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Upload className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">Drop high-density resume PDF here</p>
                        <p className="text-[10px] text-text-mute mt-1">or click to browse local directory</p>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-primary/5 text-primary border border-primary/10 px-2.5 py-0.5 rounded mt-1.5 uppercase">Max Size: 5MB</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 7: Goal Confirmation & Review (Section 9) */}
            {currentStep === 7 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-xl text-text-main flex items-center gap-2">
                    Review Trajectory Coordinates <CheckCircle className="w-5 h-5 text-success" />
                  </h2>
                  <p className="text-xs text-text-mute font-medium">Verify your profile summary parameters before launching the simulator dashboard.</p>
                </div>

                {/* Bento Grid Summary Card */}
                <div className="grid grid-cols-2 gap-3 text-left mt-2">
                  <div className="p-3 bg-[var(--hover-tint)]/45 border border-[var(--border)]/75 rounded-card flex flex-col gap-1.5 col-span-2">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase tracking-widest">Calibrated Profile</span>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-text-main">{fullName}</span>
                      <span className="text-[10px] font-mono text-text-sub">{city}, {country}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--hover-tint)]/45 border border-[var(--border)]/75 rounded-card flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase tracking-widest">Active Goals</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedGoals.map(g => (
                        <Badge key={g} variant="primary" className="text-[8px] font-bold px-1.5">{g}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--hover-tint)]/45 border border-[var(--border)]/75 rounded-card flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase tracking-widest">Skills Checked</span>
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                      {selectedSkills.length > 0 ? (
                        selectedSkills.map(s => (
                          <span key={s} className="text-[9px] bg-secondary/8 text-secondary border border-secondary/15 rounded px-1 font-bold">{s}</span>
                        ))
                      ) : (
                        <span className="text-[9px] text-text-mute">Zero inventory flagged</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--hover-tint)]/45 border border-[var(--border)]/75 rounded-card flex flex-col gap-1.5 col-span-2">
                    <span className="text-[9px] font-mono font-bold text-text-mute uppercase tracking-widest">Resume Alignment File</span>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-bold text-text-main line-clamp-1">{resumeFile ? resumeFile.name : 'No file uploaded (ATS simulator disabled)'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 8: Create Career Profile & Finalizing Trajectory */}
            {currentStep === 8 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center gap-6 py-6">
                {isFinalizing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                      <PathPilotLogo size={36} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-black text-lg text-text-main">Aligning PathPilot AI Core...</h3>
                      <p className="text-xs text-text-mute max-w-sm leading-relaxed">
                        Compiling diagnostic data structure, configuring automated career milestones, and structuring secure profile rules.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h2 className="font-display font-black text-2xl text-text-main bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">Calibration Complete!</h2>
                      <p className="text-xs text-text-mute max-w-md mx-auto leading-relaxed">
                        Your professional PathPilot AI coordinates are aligned. Click the button below to launch into your career cockpit workspace!
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Step Controls (Footer) */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--border)]/65 shrink-0">
            {currentStep > 1 && currentStep < 8 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="font-bold border-[var(--border)]"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back Coordinate
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                className="font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Step
              </Button>
            ) : currentStep === totalSteps - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                className="font-bold"
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />}
              >
                Compile Trajectory Profile
              </Button>
            ) : (
              !isFinalizing && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinalizeLaunch}
                  className="font-bold shadow-xl animate-pulse"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch Pathfinder Core Dashboard
                </Button>
              )
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
