/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, FileText, Printer, CheckCircle2, 
  Sparkles, Code, FileSpreadsheet, HardDrive
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ResumeService } from '../../../services/resumeService';

export const ResumeExportView: React.FC = () => {
  const { activeResume } = useResume();
  const { user } = useAuth();
  const { addNotification } = useCareer();
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const triggerExport = async (format: 'pdf' | 'txt' | 'json' | 'docx') => {
    if (!activeResume || !user?.id) return;
    setDownloadingFormat(format);

    try {
      if (format === 'pdf') {
        window.print();
      } else if (format === 'txt') {
        const content = activeResume.content;
        const text = `
${content.personalInfo?.fullName || 'John Doe'}
${content.personalInfo?.email} | ${content.personalInfo?.phone} | ${content.personalInfo?.location}
${content.personalInfo?.headline}
Website: ${content.personalInfo?.websiteUrl} | GitHub: ${content.personalInfo?.githubUrl}

PROFESSIONAL SUMMARY
--------------------------------------------------
${content.summary}

WORK EXPERIENCE
--------------------------------------------------
${content.experience?.map(e => `${e.title} at ${e.subtitle} (${e.dateRange})\n${e.bullets?.map(b => `• ${b}`).join('\n')}`).join('\n\n')}

PROJECTS
--------------------------------------------------
${content.projects?.map(p => `${p.title} (${p.dateRange})\n${p.bullets?.map(b => `• ${b}`).join('\n')}`).join('\n\n')}

SKILLS
--------------------------------------------------
${content.skills?.map(s => `${s.category}: ${s.items?.join(', ')}`).join('\n')}

EDUCATION
--------------------------------------------------
${content.education?.map(ed => `${ed.title} - ${ed.subtitle} (${ed.dateRange})`).join('\n')}
        `.trim();

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeResume.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        const jsonStr = JSON.stringify(activeResume.content, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeResume.title.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'docx') {
        // Fallback HTML/DOCX formatted download
        const htmlContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
          <head><meta charset='utf-8'><title>${activeResume.title}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>${activeResume.content.personalInfo?.fullName}</h1>
            <p>${activeResume.content.personalInfo?.headline}</p>
            <p>${activeResume.content.personalInfo?.email} | ${activeResume.content.personalInfo?.phone}</p>
            <hr/>
            <h2>Summary</h2>
            <p>${activeResume.content.summary}</p>
            <h2>Experience</h2>
            ${activeResume.content.experience?.map(e => `<h3>${e.title} - ${e.subtitle}</h3><p><em>${e.dateRange}</em></p><ul>${e.bullets?.map(b => `<li>${b}</li>`).join('')}</ul>`).join('')}
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeResume.title.replace(/\s+/g, '_')}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      }

      await ResumeService.logExport(user.id, activeResume.id, format, activeResume.templateId);
      addNotification('Export Complete', `Exported resume as ${format.toUpperCase()}.`, 'success');

    } catch (err) {
      console.error(err);
      addNotification('Export Failed', `Failed to generate ${format.toUpperCase()}.`, 'warning');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full animate-fade-in max-w-4xl mx-auto">
      
      {/* Option 1: PDF */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-6 flex flex-col justify-between">
        <div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl w-fit mb-3">
            <Printer className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-text-main">Vector PDF Document</h3>
          <p className="text-xs text-text-sub leading-relaxed my-2">
            Generates crisp, high-resolution vector PDF using browser print engine. Perfect for direct ATS submissions and email attachments.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => triggerExport('pdf')}
          disabled={downloadingFormat === 'pdf' || !activeResume}
          className="mt-4 text-xs font-bold h-9 flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4 text-black" /> Print / Save as PDF
        </Button>
      </Card>

      {/* Option 2: DOCX */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-6 flex flex-col justify-between">
        <div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-text-main">Microsoft Word (.DOC)</h3>
          <p className="text-xs text-text-sub leading-relaxed my-2">
            Editable Word document format. Allows recruiters and hiring managers to customize formatting or add internal headers.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => triggerExport('docx')}
          disabled={downloadingFormat === 'docx' || !activeResume}
          className="mt-4 text-xs font-bold h-9 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-black" /> Download Word Doc
        </Button>
      </Card>

      {/* Option 3: TXT */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-6 flex flex-col justify-between">
        <div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-text-main">Plain Text (.TXT)</h3>
          <p className="text-xs text-text-sub leading-relaxed my-2">
            Raw unformatted text file. Ideal for copy-pasting into online job application forms (Workday, Greenhouse, Lever).
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerExport('txt')}
          disabled={downloadingFormat === 'txt' || !activeResume}
          className="mt-4 text-xs font-bold h-9 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Plain Text
        </Button>
      </Card>

      {/* Option 4: JSON */}
      <Card className="bg-[var(--surface)] border-[var(--border)] p-6 flex flex-col justify-between">
        <div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl w-fit mb-3">
            <Code className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-text-main">Structured JSON Data</h3>
          <p className="text-xs text-text-sub leading-relaxed my-2">
            Full structured JSON schema. Useful for migrating data, developer portfolios, or custom API integrations.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerExport('json')}
          disabled={downloadingFormat === 'json' || !activeResume}
          className="mt-4 text-xs font-bold h-9 flex items-center justify-center gap-2"
        >
          <Code className="w-4 h-4" /> Download JSON Payload
        </Button>
      </Card>

    </div>
  );
};
