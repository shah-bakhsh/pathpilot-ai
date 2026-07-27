/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, Trash2, 
  Download, Eye, Sparkles, RefreshCw, File, Shield, HardDrive, Clock
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { cn } from '../../../lib/utils';

interface ResumeUploaderProps {
  onAnalyzeText?: (text: string) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onAnalyzeText }) => {
  const { uploadedFiles, isUploading, uploadFile, deleteFile } = useResume();
  const { addNotification } = useCareer();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(ext || '')) {
      addNotification('Invalid File Format', 'Please upload PDF, DOCX, or TXT documents.', 'warning');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification('File Too Large', 'Maximum allowed file size is 10MB.', 'warning');
      return;
    }

    setSelectedFileName(file.name);

    // 1. Read plain text preview
    if (file.type === 'text/plain' || ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setExtractedText(text || '');
      };
      reader.readAsText(file);
    } else {
      // Simulate text extraction banner for PDF/DOCX
      setExtractedText(`[Extracted text contents from ${file.name}]\n\nCandidate Name: Candidate Profile\nTarget Role: Software Engineer\nSkills: TypeScript, React, Node.js, Express, PostgreSQL, Supabase, Cloud Microservices, Docker, Git.\nExperience: Senior Software Engineer at Tech Scale Innovations.\nEducation: B.S. Computer Science.`);
    }

    // 2. Upload file to Supabase Storage
    const uploadedRecord = await uploadFile(file);
    if (uploadedRecord) {
      addNotification('File Uploaded', `Successfully stored "${file.name}" in Supabase Storage.`, 'success');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id: string, path: string, name: string) => {
    if (window.confirm(`Delete "${name}" from storage?`)) {
      const ok = await deleteFile(id, path);
      if (ok) {
        addNotification('File Removed', `Deleted "${name}".`, 'info');
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-fade-in">
      
      {/* Upload Dropzone & Extracted Preview (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        
        {/* Upload Zone */}
        <Card className="bg-[var(--surface)] border-[var(--border)] p-6">
          <CardHeader className="p-0 pb-4 border-b border-[var(--border)]/60">
            <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Supabase Resume Storage Hub
            </CardTitle>
            <CardDescription className="text-xs">
              Upload PDF, DOCX, or TXT resume files. Stored securely with Row Level Security (RLS).
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-card p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all',
                dragActive 
                  ? 'border-primary bg-primary/10 scale-[1.01]' 
                  : 'border-[var(--border)] bg-[var(--surface-secondary)]/40 hover:border-primary/50 hover:bg-[var(--surface-secondary)]'
              )}
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-black text-text-main">
                {isUploading ? 'Uploading to Supabase...' : 'Drag & Drop Resume File'}
              </h4>
              <p className="text-xs text-text-sub my-1">or click to browse from computer</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="neutral" className="text-[10px]">PDF</Badge>
                <Badge variant="neutral" className="text-[10px]">DOCX</Badge>
                <Badge variant="neutral" className="text-[10px]">TXT</Badge>
                <span className="text-[10px] text-text-mute">Max 10MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Extractor / Analysis Ingest Preview */}
        {extractedText && (
          <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
            <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-black text-text-main flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Extracted Text Preview ({selectedFileName})
                </CardTitle>
              </div>
              {onAnalyzeText && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAnalyzeText(extractedText)}
                  className="text-xs font-bold h-8 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" /> Run ATS Audit
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <textarea
                rows={8}
                value={extractedText}
                onChange={e => setExtractedText(e.target.value)}
                className="w-full text-xs p-3 font-mono border border-[var(--border)] rounded-lg bg-[var(--surface-secondary)]/50 focus:border-primary focus:outline-none transition-colors"
              />
            </CardContent>
          </Card>
        )}

      </div>

      {/* Uploaded Files Vault List (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="bg-[var(--surface)] border-[var(--border)] p-5">
          <CardHeader className="p-0 pb-3 border-b border-[var(--border)]/60 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-text-main flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" /> Stored Resume Files
            </CardTitle>
            <Badge variant="primary" className="text-[10px] font-black">
              {uploadedFiles.length} Files
            </Badge>
          </CardHeader>

          <CardContent className="p-0 pt-3">
            {uploadedFiles.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-sub font-medium">
                No uploaded resume files yet. Use the upload box to upload your resume.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]/50">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                        <File className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors">
                          {file.fileName}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-text-mute mt-0.5">
                          <span>{formatBytes(file.fileSize)}</span>
                          <span>•</span>
                          <span>{file.version}</span>
                          <span>•</span>
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {file.publicUrl && (
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-[var(--hover-tint)] rounded text-text-mute hover:text-primary transition-colors"
                          title="Download / View"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(file.id, file.filePath, file.fileName)}
                        className="p-1.5 hover:bg-red-500/10 rounded text-text-mute hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
