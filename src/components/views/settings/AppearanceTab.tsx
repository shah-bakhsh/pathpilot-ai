/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Laptop, Palette, Type, Sliders, Layout, EyeOff, 
  Check, Info, RefreshCw, Layers 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

export const AppearanceTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { theme, setTheme } = useTheme();
  const { addXp } = useAuth();

  // Load remaining appearance states from local storage
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('pathpilot-accent-color') || 'emerald');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('pathpilot-font-size') || 'md');
  const [layoutDensity, setLayoutDensity] = useState(() => localStorage.getItem('pathpilot-layout-density') || 'comfortable');
  const [sidebarPosition, setSidebarPosition] = useState(() => localStorage.getItem('pathpilot-sidebar-pos') || 'left');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('pathpilot-reduced-motion') === 'true');

  const [savingState, setSavingState] = useState(false);

  const accentColors = [
    { id: 'emerald', label: 'Emerald Spring', hex: '#10b981', desc: 'Default system look' },
    { id: 'violet', label: 'Indigo Velvet', hex: '#8b5cf6', desc: 'Vibrant studio energy' },
    { id: 'amber', label: 'Amber Flame', hex: '#f59e0b', desc: 'Warn, highly legible' },
    { id: 'rose', label: 'Blossom Rose', hex: '#f43f5e', desc: 'Sleek luxury design' },
    { id: 'blue', label: 'Classic Cobalt', hex: '#3b82f6', desc: 'Professional tech trust' },
  ];

  const fontSizes = [
    { id: 'sm', label: 'Compact Type', size: '13px', desc: 'Maximizes dashboard density.' },
    { id: 'md', label: 'Standard Type', size: '15px', desc: 'Optimized reading comfort.' },
    { id: 'lg', label: 'Display Type', size: '17px', desc: 'Enhanced accessibility scale.' },
  ];

  const densities = [
    { id: 'compact', label: 'Compact Mode', desc: 'Reduces block padding for maximum content layout.' },
    { id: 'comfortable', label: 'Comfortable Mode', desc: 'Generous whitespace with structured room.' },
  ];

  const saveAppearance = () => {
    setSavingState(true);
    setTimeout(() => {
      setSavingState(false);
      localStorage.setItem('pathpilot-accent-color', accentColor);
      localStorage.setItem('pathpilot-font-size', fontSize);
      localStorage.setItem('pathpilot-layout-density', layoutDensity);
      localStorage.setItem('pathpilot-sidebar-pos', sidebarPosition);
      localStorage.setItem('pathpilot-reduced-motion', reducedMotion ? 'true' : 'false');
      
      // Inject accent color variables dynamically if needed, or simply save state
      onUpdateNotification('Appearance Synced', 'Theme and interface geometry rules saved.', 'success');
      addXp(10);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Overview Block */}
      <div className="p-4 rounded-card bg-[var(--surface-secondary)]/30 border border-[var(--border)] flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-text-main">Interface Styles & Customization</h3>
            <p className="text-[10px] text-text-mute font-semibold mt-0.5">Customize accent lines, layout geometry, animation parameters, and viewing mode.</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={saveAppearance} disabled={savingState} className="bg-primary text-black font-black text-xs h-8">
          {savingState ? 'Saving...' : 'Apply Styles'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Theme mode selectors */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Sun className="w-4 h-4 text-primary" /> Global Interface Theme</CardTitle>
            <CardDescription>Select the default brightness envelope of the platform layout. Changes save immediately.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4 text-warning" />, desc: 'Bright, high-contrast, clean canvas layout.' },
              { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-accent animate-pulse" />, desc: 'Premium twilight luxury dark style.' },
              { id: 'system', label: 'System Default', icon: <Laptop className="w-4 h-4 text-text-sub" />, desc: 'Synchronizes layout with your host OS settings.' }
            ].map((item) => {
              const isActive = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id as any);
                    onUpdateNotification(`${item.label} Enabled`, 'Aesthetic theme configuration updated.', 'success');
                  }}
                  className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface-secondary)]/45 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded ${isActive ? 'bg-primary/10 text-primary' : 'bg-[var(--hover-tint)] text-text-mute'}`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-text-main uppercase tracking-tight">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-text-mute leading-normal font-semibold">{item.desc}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Accent Colors Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Palette className="w-4 h-4 text-primary" /> Primary Accent Tone</CardTitle>
            <CardDescription>Tailor key interactive button highlights and status tags.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {accentColors.map((color) => {
              const isActive = accentColor === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                    isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-main">{color.label}</span>
                      <span className="text-[9px] text-text-mute font-semibold">{color.desc}</span>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Font scales and layouts */}
        <div className="flex flex-col gap-6">
          {/* Typography Scale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Type className="w-4 h-4 text-primary" /> Typographic Scale</CardTitle>
              <CardDescription>Calibrate readability and font weights across files.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((sz) => {
                  const isActive = fontSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() => setFontSize(sz.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-150 ${
                        isActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 hover:border-primary/20'
                      }`}
                    >
                      <span className="font-bold text-xs text-text-main" style={{ fontSize: sz.size }}>Aa</span>
                      <span className="text-[9px] text-text-mute font-black uppercase tracking-wider">{sz.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Density settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-4 h-4 text-primary" /> Layout Density</CardTitle>
              <CardDescription>Calibrate viewport block spacing heights.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                {densities.map((den) => {
                  const isActive = layoutDensity === den.id;
                  return (
                    <button
                      key={den.id}
                      onClick={() => setLayoutDensity(den.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all duration-150 ${
                        isActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-[var(--border)] bg-[var(--surface-secondary)]/20 hover:border-primary/20'
                      }`}
                    >
                      <span className="font-bold text-xs text-text-main">{den.label}</span>
                      <span className="text-[9px] text-text-mute leading-snug font-semibold mt-0.5">{den.desc}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Advanced accessibility controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /> Advanced Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Reduced Motion</span>
                  <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Disables heavy canvas animations and transitions.</p>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-9 h-5 rounded-full transition-all duration-150 relative border ${
                    reducedMotion ? 'bg-primary border-primary' : 'bg-transparent border-[var(--border)]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-text-main absolute top-0.5 transition-all ${
                    reducedMotion ? 'right-0.5 bg-black' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Sidebar positioning */}
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/40 border border-[var(--border)] rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main">Sidebar Position</span>
                  <p className="text-[9.5px] text-text-mute leading-normal font-semibold mt-0.5">Anchors side nav drawer panel position.</p>
                </div>
                <div className="flex border border-[var(--border)] rounded-lg overflow-hidden shrink-0">
                  <button 
                    onClick={() => setSidebarPosition('left')}
                    className={`px-2.5 py-1 text-[9.5px] font-black uppercase ${sidebarPosition === 'left' ? 'bg-primary text-black' : 'bg-transparent text-text-mute hover:bg-[var(--hover-tint)]'}`}
                  >
                    Left
                  </button>
                  <button 
                    onClick={() => setSidebarPosition('right')}
                    className={`px-2.5 py-1 text-[9.5px] font-black uppercase ${sidebarPosition === 'right' ? 'bg-primary text-black' : 'bg-transparent text-text-mute hover:bg-[var(--hover-tint)]'}`}
                  >
                    Right
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
