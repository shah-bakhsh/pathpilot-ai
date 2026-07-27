/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Progress } from './Progress';

export interface UploadZoneProps {
  onUpload: (text: string) => void;
  isUploading?: boolean;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  isUploading = false,
  className,
}) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError('');
    
    // Validate file extensions
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(extension || '')) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Capture file details
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
    
    // Simulate reading & upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Pass dummy/parsed content to parent triggers
          const sampleParsedText = `RESUME: ${file.name}\nSize: ${file.size} bytes\nMock parsed credentials and professional experience.`;
          onUpload(sampleParsedText);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full flex flex-col gap-3', className)}>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
          'w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-card cursor-pointer transition-all duration-300 bg-[var(--surface)]',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-[var(--border)] hover:border-primary/50 hover:bg-[var(--hover-tint)]/40',
          fileName && 'border-primary/25 bg-primary/2',
          isUploading && 'pointer-events-none opacity-85',
          error && 'border-error/40 bg-error/2 hover:border-error/60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        {uploadProgress > 0 && uploadProgress < 100 ? (
          <div className="w-full max-w-xs text-center flex flex-col items-center gap-3 py-4">
            <FileText className="w-10 h-10 text-primary animate-pulse" />
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs font-semibold text-text-main truncate max-w-[200px] mx-auto">
                {fileName}
              </span>
              <span className="text-[10px] text-text-mute">{fileSize}</span>
            </div>
            <Progress value={uploadProgress} size="sm" variant="primary" />
            <span className="text-[10px] text-text-mute">Uploading & Sanitizing...</span>
          </div>
        ) : uploadProgress === 100 ? (
          <div className="text-center flex flex-col items-center gap-2 py-4">
            <CheckCircle className="w-10 h-10 text-success" />
            <span className="text-xs font-semibold text-text-main truncate max-w-[200px] mx-auto">
              {fileName}
            </span>
            <span className="text-[10px] text-text-mute">{fileSize} • Ready for evaluation</span>
            <span className="text-[10px] text-primary hover:underline font-semibold mt-1">
              Replace file
            </span>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-primary/5 text-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-text-main">
                Drag & drop your resume, or <span className="text-primary hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-text-mute">
                Supports PDF, DOCX, or TXT (Max 8,000 characters parsed)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-btn bg-error/5 text-error border border-error/10 text-[11px] font-medium leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
