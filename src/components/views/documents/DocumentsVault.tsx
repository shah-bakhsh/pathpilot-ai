/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, FileText, Download, Trash2, Search, Filter, Upload, AlertCircle, 
  Sparkles, CheckCircle2, RefreshCw, Star, HardDrive, ShieldAlert, BadgeInfo,
  Plus
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useCareer } from '../../../contexts/CareerContext';
import { cn } from '../../../lib/utils';
import { CareerDocument } from '../../../types';

export const DocumentsVault: React.FC = () => {
  const { careerDocuments, addCareerDocument, deleteCareerDocument, addNotification } = useCareer();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Drag and drop upload states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual mock upload
  const [mockUploadName, setMockUploadName] = useState<string>('');
  const [mockUploadType, setMockUploadType] = useState<CareerDocument['type']>('resume');

  // Document types map
  const DOCUMENT_TYPES: Array<{ id: string; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Files', icon: <Folder className="w-3.5 h-3.5" /> },
    { id: 'resume', label: 'Resumes', icon: <FileText className="w-3.5 h-3.5 text-primary" /> },
    { id: 'cover_letter', label: 'Cover Letters', icon: <FileText className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'certificate', label: 'Certifications', icon: <Star className="w-3.5 h-3.5 text-yellow-400" /> },
    { id: 'transcript', label: 'Transcripts', icon: <FileText className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  // Filter list
  const filteredDocuments = careerDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalDocs = careerDocuments.length;
  const averageScore = careerDocuments.filter(d => typeof d.score === 'number').length > 0
    ? Math.round(careerDocuments.reduce((acc, d) => acc + (d.score || 0), 0) / careerDocuments.filter(d => typeof d.score === 'number').length)
    : 0;

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Determine type from extension
    let type: CareerDocument['type'] = 'resume';
    if (file.name.toLowerCase().includes('cover') || file.name.toLowerCase().includes('letter')) {
      type = 'cover_letter';
    } else if (file.name.toLowerCase().includes('cert') || file.name.toLowerCase().includes('badge')) {
      type = 'certificate';
    } else if (file.name.toLowerCase().includes('transcript') || file.name.toLowerCase().includes('gpa')) {
      type = 'transcript';
    }

    addCareerDocument({
      name: file.name,
      type: type,
      url: '#',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      version: 'v1.0',
      score: type === 'resume' ? 78 : undefined // auto score mock for test
    });
  };

  const handleManualMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockUploadName.trim()) return;

    addCareerDocument({
      name: mockUploadName.endsWith('.pdf') || mockUploadName.endsWith('.docx') ? mockUploadName : `${mockUploadName}.pdf`,
      type: mockUploadType,
      url: '#',
      size: `${(Math.random() * 200 + 50).toFixed(1)} KB`,
      version: 'v1.0',
      score: mockUploadType === 'resume' ? 84 : undefined
    });

    setMockUploadName('');
    addNotification('Document Created', 'Registered manual mock credentials in the Document Center.', 'success');
  };

  const getDocTypeIcon = (type: CareerDocument['type']) => {
    switch (type) {
      case 'resume':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'cover_letter':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'certificate':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'transcript':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileText className="w-5 h-5 text-text-mute" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      
      {/* Upload Zone & Stats (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Cloud Stats */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-b border-[var(--border)]/60">
            <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-primary" /> Storage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col p-3 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)]/80 text-center">
              <span className="text-xl font-display font-black text-text-main leading-none">{totalDocs}</span>
              <span className="text-[8.5px] text-text-mute font-black uppercase tracking-wider mt-1">Total Files</span>
            </div>
            <div className="flex flex-col p-3 rounded-lg bg-[var(--surface-secondary)]/30 border border-[var(--border)]/80 text-center">
              <span className="text-xl font-display font-black text-text-main leading-none">{averageScore}%</span>
              <span className="text-[8.5px] text-text-mute font-black uppercase tracking-wider mt-1">Average ATS</span>
            </div>
          </CardContent>
        </Card>

        {/* Drag & Drop Upload Block */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="pt-6 pb-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none min-h-[160px]',
                isDragging 
                  ? 'border-primary bg-primary/2 text-primary' 
                  : 'border-[var(--border)] hover:border-primary/20 bg-[var(--surface-secondary)]/10 text-text-mute'
              )}
            >
              <Upload className={cn('w-8 h-8 stroke-[1.5] mb-2', isDragging ? 'text-primary' : 'text-text-mute/60')} />
              <span className="text-[11.5px] font-black text-text-main">Drag & Drop files here</span>
              <span className="text-[9px] text-text-mute mt-1 font-semibold leading-normal">
                Supports PDF, DOCX, PNG (Max 5MB)<br />We automatically tag and route categories.
              </span>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Manual Input Register */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-2 border-b border-[var(--border)]/60">
            <CardTitle className="text-xs font-black text-text-sub uppercase tracking-wider">
              Register Credentials Record
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3.5">
            <form onSubmit={handleManualMockUpload} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-text-mute uppercase tracking-wider">Document Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford_GPA_Transcript"
                  value={mockUploadName}
                  onChange={e => setMockUploadName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-text-mute uppercase tracking-wider">Document Category</label>
                <select
                  value={mockUploadType}
                  onChange={e => setMockUploadType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="resume">Resume / CV</option>
                  <option value="cover_letter">Cover Letter</option>
                  <option value="certificate">Certification / Badge</option>
                  <option value="transcript">Academic Transcript</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!mockUploadName.trim()}
                className="text-[9.5px] h-8 px-4 font-black flex items-center justify-center gap-1 bg-primary text-black cursor-pointer shadow-md w-full"
              >
                <Plus className="w-3.5 h-3.5" /> Deposit Record
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>

      {/* Explorer Table List (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-card w-full shadow-sm">
          
          {/* Category Pills */}
          <div className="flex rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] p-0.5 overflow-x-auto scrollbar-none w-full md:w-auto">
            {DOCUMENT_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={cn(
                  'text-[9px] font-black px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0',
                  selectedType === t.id
                    ? 'bg-primary text-black font-black'
                    : 'text-text-mute hover:text-text-sub'
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-60 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-mute" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* List Content */}
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="p-0 overflow-x-auto">
            {filteredDocuments.length > 0 ? (
              <table className="w-full border-collapse text-left text-xs text-text-sub">
                <thead>
                  <tr className="border-b border-[var(--border)]/60 bg-[var(--surface-secondary)]/10 font-bold text-text-mute text-[9.5px] uppercase tracking-widest select-none">
                    <th className="py-3 px-4 font-black">File Metadata</th>
                    <th className="py-3 px-4 font-black">Upload Date</th>
                    <th className="py-3 px-4 font-black">Size / Version</th>
                    <th className="py-3 px-4 font-black">ATS Score</th>
                    <th className="py-3 px-4 text-right font-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40">
                  {filteredDocuments.map(doc => (
                    <tr key={doc.id} className="hover:bg-[var(--hover-tint)]/10 group transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="p-2 bg-[var(--surface-secondary)] rounded-lg shrink-0">
                          {getDocTypeIcon(doc.type)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-[11.5px] text-text-main truncate">{doc.name}</span>
                          <span className="text-[9.5px] text-text-mute uppercase tracking-widest font-black mt-0.5">{doc.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-text-mute font-semibold">
                        {new Date(doc.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-text-sub font-bold">{doc.size}</span>
                          <Badge variant="neutral" className="text-[8px] font-extrabold px-1.5 py-0">
                            {doc.version}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {typeof doc.score === 'number' ? (
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'text-[10px] font-black font-mono',
                              doc.score >= 80 ? 'text-success' : doc.score >= 60 ? 'text-primary' : 'text-danger'
                            )}>
                              {doc.score}%
                            </span>
                            <span className="text-[8.5px] text-text-mute font-semibold">Match</span>
                          </div>
                        ) : (
                          <span className="text-[9.5px] text-text-mute font-semibold italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { alert(`Downloading file: ${doc.name}`); }}
                            className="p-1 h-7 w-7 text-text-mute hover:text-primary rounded cursor-pointer"
                            title="Download document record"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCareerDocument(doc.id)}
                            className="p-1 h-7 w-7 text-text-mute hover:text-danger rounded cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-16 text-center text-text-mute flex flex-col items-center justify-center">
                <Folder className="w-12 h-12 text-text-mute/30 stroke-[1.5]" />
                <h4 className="text-xs font-black text-text-main mt-4 uppercase tracking-wider">No files mapped</h4>
                <p className="text-[10px] text-text-mute mt-1 max-w-xs leading-normal">
                  No files matched your search or category filter. Drag & Drop a document to index it inside the vault.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default DocumentsVault;
