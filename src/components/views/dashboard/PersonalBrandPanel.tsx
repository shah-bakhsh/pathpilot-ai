/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Linkedin, Github, Globe, Check, Link2, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useCareer } from '../../../contexts/CareerContext';
import { cn } from '../../../lib/utils';

export const PersonalBrandPanel: React.FC = () => {
  const { addNotification } = useCareer();
  const [linkedInConnected, setLinkedInConnected] = useState<boolean>(true);
  const [gitHubConnected, setGitHubConnected] = useState<boolean>(false);
  const [portfolioConnected, setPortfolioConnected] = useState<boolean>(false);

  const calculateScore = () => {
    let score = 40;
    if (linkedInConnected) score += 20;
    if (gitHubConnected) score += 20;
    if (portfolioConnected) score += 20;
    return score;
  };

  const handleToggleConnect = (platform: 'linkedin' | 'github' | 'portfolio') => {
    if (platform === 'linkedin') {
      const next = !linkedInConnected;
      setLinkedInConnected(next);
      addNotification(
        next ? 'LinkedIn Sync Complete' : 'LinkedIn Disconnected',
        next ? 'Successfully mapped professional profile connections.' : 'Removed LinkedIn connection map.',
        next ? 'success' : 'warning'
      );
    } else if (platform === 'github') {
      const next = !gitHubConnected;
      setGitHubConnected(next);
      addNotification(
        next ? 'GitHub Metadata Synced' : 'GitHub Disconnected',
        next ? 'Scanned repositories for matching tech keywords.' : 'Removed GitHub linkage.',
        next ? 'success' : 'warning'
      );
    } else if (platform === 'portfolio') {
      const next = !portfolioConnected;
      setPortfolioConnected(next);
      addNotification(
        next ? 'Portfolio Registered' : 'Portfolio Link Removed',
        next ? 'Portfolio domain verified by PathPilot.' : 'Removed portfolio registration.',
        next ? 'success' : 'warning'
      );
    }
  };

  const score = calculateScore();

  return (
    <Card className="w-full border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black text-text-main flex items-center gap-1.5">
            <Globe className="w-4.5 h-4.5 text-primary" /> Personal Brand Footprint
          </CardTitle>
          <span className="text-[10px] text-text-mute font-black uppercase tracking-widest bg-[var(--hover-tint)] px-2 py-0.5 rounded border border-[var(--border)]/40">
            Brand Rating
          </span>
        </div>
        <CardDescription className="text-[10px]">
          Synchronize public tech channels to verify credentials and unlock matching filter coordinates.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Visual score display */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-gradient-to-br from-primary/5 via-accent/2 to-transparent border border-primary/10">
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-primary/10 bg-[var(--surface)] shadow-inner shrink-0">
            {/* Glowing background ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--color-primary)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="176"
                strokeDashoffset={176 - (176 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="text-sm font-display font-black text-primary">{score}%</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-text-sub flex items-center gap-1 leading-none uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" /> Channel Alignment Index
            </span>
            <p className="text-[10.5px] text-text-mute leading-snug mt-1.5 font-medium">
              {score >= 80 
                ? 'Excellent brand footprints! Your profiles are highly synchronized for maximum recruiter visibility.' 
                : 'Connect and sync additional coordinates (like active GitHub repositories) to increase AI screening match index.'}
            </p>
          </div>
        </div>

        {/* Channels list of items */}
        <div className="flex flex-col gap-2.5">
          {/* LinkedIn item */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 transition-all duration-150 hover:border-primary/20 hover:bg-[var(--surface-secondary)]/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center shrink-0 border border-[#0077b5]/20">
                <Linkedin className="w-4 h-4 fill-[#0077b5]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-text-main leading-none">LinkedIn Profile</span>
                <span className={cn('text-[9px] font-bold mt-1.5', linkedInConnected ? 'text-success' : 'text-text-mute')}>
                  {linkedInConnected ? '✓ Active Connection Synced' : 'Offline / Unlinked'}
                </span>
              </div>
            </div>
            <Button
              variant={linkedInConnected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleConnect('linkedin')}
              className={cn(
                'text-[10px] h-7 px-3 font-extrabold transition-all duration-150 active:scale-95 shrink-0',
                linkedInConnected ? 'border-[var(--border)] hover:bg-danger/5 hover:text-danger hover:border-danger/25' : 'bg-primary text-black'
              )}
            >
              {linkedInConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          {/* GitHub item */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 transition-all duration-150 hover:border-primary/20 hover:bg-[var(--surface-secondary)]/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-text-sub/10 text-text-main flex items-center justify-center shrink-0 border border-[var(--border)]">
                <Github className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-text-main leading-none">GitHub Repositories</span>
                <span className={cn('text-[9px] font-bold mt-1.5', gitHubConnected ? 'text-success' : 'text-text-mute')}>
                  {gitHubConnected ? '✓ Verification Node Synced' : 'Offline / Unlinked'}
                </span>
              </div>
            </div>
            <Button
              variant={gitHubConnected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleConnect('github')}
              className={cn(
                'text-[10px] h-7 px-3 font-extrabold transition-all duration-150 active:scale-95 shrink-0',
                gitHubConnected ? 'border-[var(--border)] hover:bg-danger/5 hover:text-danger hover:border-danger/25' : 'bg-primary text-black'
              )}
            >
              {gitHubConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          {/* Portfolio item */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 transition-all duration-150 hover:border-primary/20 hover:bg-[var(--surface-secondary)]/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-text-main leading-none">Personal Portfolio</span>
                <span className={cn('text-[9px] font-bold mt-1.5', portfolioConnected ? 'text-success' : 'text-text-mute')}>
                  {portfolioConnected ? '✓ Domain Coordinates Verified' : 'Offline / Unlinked'}
                </span>
              </div>
            </div>
            <Button
              variant={portfolioConnected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleConnect('portfolio')}
              className={cn(
                'text-[10px] h-7 px-3 font-extrabold transition-all duration-150 active:scale-95 shrink-0',
                portfolioConnected ? 'border-[var(--border)] hover:bg-danger/5 hover:text-danger hover:border-danger/25' : 'bg-primary text-black'
              )}
            >
              {portfolioConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>

        {/* AI Branding Tip Box */}
        <div className="p-3 rounded-lg border border-primary/10 bg-primary/2 flex gap-2 items-start mt-1">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-text-sub leading-normal font-semibold">
            Connecting public repositories and portfolios allows the <strong className="text-primary font-bold">Gemini Trajectory Engine</strong> to crawl live code ratios and automatically verify technical skills inside your main dashboard dashboard workspace.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalBrandPanel;
