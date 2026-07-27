/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Upload, Download, Trash2, CheckCircle2, 
  ExternalLink, File, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface FileVaultProps {
  documents: any[];
  onUploadDocument: (fileName: string, fileType: string, fileDataUrl: string, fileSize: string) => void;
  onDeleteDocument: (id: string) => void;
}

export const FileVault: React.FC<FileVaultProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'resume' | 'cover_letter' | 'certificate'>('all');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onUploadDocument(
          file.name, 
          file.type, 
          url, 
          `${Math.round(file.size / 1024)} KB`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onUploadDocument(
          file.name, 
          file.type, 
          url, 
          `${Math.round(file.size / 1024)} KB`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDocs = documents.filter(d => selectedCategory === 'all' || d.type === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      
      {/* Upload Dropzone Area */}
      <Card className="lg:col-span-1 bg-slate-900/20 border-slate-800 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Vault Secure Ingest</h3>
          <p className="text-[11px] text-slate-400">Upload PDF, DOCX, TXT resumes, Cover Letters, or Certifications directly to your profile vault.</p>
        </div>

        {/* Drag Dropzone */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-6 text-center mt-4 flex flex-col items-center justify-center min-h-[220px] transition-all relative ${
            dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <Upload className={`w-8 h-8 mb-3 transition-transform ${dragActive ? 'text-indigo-400 scale-110' : 'text-slate-500'}`} />
          <span className="text-xs text-slate-300 font-bold block">Drag files here to upload</span>
          <span className="text-[10px] text-slate-500 my-1 font-bold">Or click to select from file systems</span>
          
          <input 
            type="file" 
            id="vaultFileInput"
            onChange={handleFileInputChange}
            accept=".pdf,.docx,.txt,.png,.jpg"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 mt-4 text-[9px] text-slate-500 font-bold bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Files are encrypted and stored in safe full-stack containers. Maximum size ceiling: 10MB.</span>
        </div>
      </Card>

      {/* Vault Directory Lists */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        
        {/* Filtering segment */}
        <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-1.5">
            {['all', 'resume', 'cover_letter', 'certificate'].map((cat) => (
              <Button 
                key={cat} 
                variant={selectedCategory === cat ? 'primary' : 'outline'} 
                size="sm" 
                className="h-8 text-[10px] uppercase font-bold"
                onClick={() => setSelectedCategory(cat as any)}
              >
                {cat.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Vault list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="bg-slate-900/30 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white leading-normal truncate">{doc.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{doc.type.replace('_', ' ')}</span>
                  </div>
                </div>

                <button onClick={() => onDeleteDocument(doc.id)} className="text-slate-500 hover:text-rose-400 p-1 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Score indicator (e.g. for Resumes) */}
              {doc.type === 'resume' && (
                <div className="mt-4 p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Diagnostic Alignment Rating
                  </span>
                  <Badge variant="success" className="text-[10px] px-1.5 font-bold">85/100</Badge>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-800/60">
                <span>{doc.size}</span>
                <a href={doc.url} download className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-extrabold uppercase">
                  Download <Download className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-slate-800 bg-slate-900/10 rounded-3xl">
              <File className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <span className="text-xs text-slate-400 block font-bold">Vault directory is empty.</span>
              <p className="text-[10px] text-slate-500 mt-1">Upload resumes or credentials in the Ingest panel to initialize vault records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
