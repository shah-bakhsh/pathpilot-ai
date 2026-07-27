/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, User, Mail, Globe, MapPin, Phone, Clock, Languages, 
  Linkedin, Github, ShieldAlert, Sparkles, Check, Info, Trash2, Camera, Loader2 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';

export const GeneralTab: React.FC<{
  onUpdateNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}> = ({ onUpdateNotification }) => {
  const { user, updateProfile, uploadAvatar, uploadCover, addXp } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [generalData, setGeneralData] = useState(() => {
    return {
      name: user?.name || 'Pathfinder Explorer',
      username: user?.username || user?.email?.split('@')[0] || 'explorer',
      email: user?.email || 'explorer@pathpilot.ai',
      phone: user?.phone || '',
      location: [user?.city, user?.country].filter(Boolean).join(', ') || '',
      timezone: user?.timezone || 'America/Los_Angeles',
      language: user?.preferredLanguage || 'English (US)',
      website: user?.websiteUrl || '',
      linkedin: user?.linkedinUrl || '',
      github: user?.githubUrl || '',
      twitter: '',
      avatarUrl: user?.avatarUrl || '',
      coverUrl: user?.coverUrl || '',
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setGeneralData({
        name: user.name || 'Pathfinder Explorer',
        username: user.username || user.email?.split('@')[0] || 'explorer',
        email: user.email || 'explorer@pathpilot.ai',
        phone: user.phone || '',
        location: [user.city, user.country].filter(Boolean).join(', ') || '',
        timezone: user.timezone || 'America/Los_Angeles',
        language: user.preferredLanguage || 'English (US)',
        website: user.websiteUrl || '',
        linkedin: user.linkedinUrl || '',
        github: user.githubUrl || '',
        twitter: '',
        avatarUrl: user.avatarUrl || '',
        coverUrl: user.coverUrl || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: generalData.name,
        username: generalData.username,
        phone: generalData.phone,
        timezone: generalData.timezone,
        preferredLanguage: generalData.language,
        websiteUrl: generalData.website,
        linkedinUrl: generalData.linkedin,
        githubUrl: generalData.github,
      });

      addXp(15);
      onUpdateNotification('Settings Updated', 'General account settings and user profile synchronized.', 'success');
    } catch (e) {
      console.error(e);
      onUpdateNotification('Sync Error', 'Failed to update general settings.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setGeneralData({
        name: user.name || 'Pathfinder Explorer',
        username: user.username || user.email?.split('@')[0] || 'explorer',
        email: user.email || 'explorer@pathpilot.ai',
        phone: user.phone || '',
        location: [user.city, user.country].filter(Boolean).join(', ') || '',
        timezone: user.timezone || 'America/Los_Angeles',
        language: user.preferredLanguage || 'English (US)',
        website: user.websiteUrl || '',
        linkedin: user.linkedinUrl || '',
        github: user.githubUrl || '',
        twitter: '',
        avatarUrl: user.avatarUrl || '',
        coverUrl: user.coverUrl || '',
      });
    }
    onUpdateNotification('Fields Reverted', 'Changes discarded.', 'info');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(file);
      setGeneralData(prev => ({ ...prev, avatarUrl: url }));
      onUpdateNotification('Avatar Photo Updated', 'Profile avatar synchronized with Supabase Storage.', 'success');
      addXp(20);
    } catch (err: any) {
      console.error(err);
      onUpdateNotification('Upload Failed', 'Could not upload avatar image.', 'warning');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const url = await uploadCover(file);
      setGeneralData(prev => ({ ...prev, coverUrl: url }));
      onUpdateNotification('Cover Photo Updated', 'Profile cover photo updated in Supabase Storage.', 'success');
      addXp(20);
    } catch (err: any) {
      console.error(err);
      onUpdateNotification('Upload Failed', 'Could not upload cover image.', 'warning');
    } finally {
      setIsUploadingCover(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Hidden file inputs */}
      <input 
        ref={avatarInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange} 
      />
      <input 
        ref={coverInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleCoverChange} 
      />

      {/* Visual Header Grid for Images */}
      <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]">
        {/* Cover Photo */}
        <div className="h-40 w-full relative group">
          <img 
            src={generalData.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} 
            alt="Cover" 
            className="w-full h-full object-cover filter brightness-75 group-hover:brightness-50 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
          <button 
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer disabled:opacity-50"
          >
            {isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            {isUploadingCover ? 'Uploading...' : 'Change Cover'}
          </button>
        </div>

        {/* Profile Avatar Overlay Row */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group shrink-0">
              <img 
                src={generalData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-[var(--surface)] object-cover shadow-lg group-hover:brightness-50 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <button 
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 flex items-center justify-center text-white bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer disabled:opacity-50"
              >
                {isUploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex flex-col pb-2">
              <h3 className="font-display font-black text-md text-text-main uppercase tracking-tight">{generalData.name}</h3>
              <p className="text-[11px] text-text-mute font-semibold mt-0.5">@{generalData.username}</p>
            </div>
          </div>

          <Badge variant="neutral" className="bg-primary/10 border border-primary/20 text-primary text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5">
            MEMBER SINCE JULY 2026
          </Badge>
        </div>
      </Card>

      {/* Profile/General Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core details fields */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Configure core system fields. Ensure your email is verified.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Display Name</label>
                  <Input 
                    value={generalData.name} 
                    onChange={e => setGeneralData({ ...generalData, name: e.target.value })}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[11px] text-text-mute font-black select-none">@</span>
                    <Input 
                      value={generalData.username} 
                      onChange={e => setGeneralData({ ...generalData, username: e.target.value })}
                      className="text-xs h-9 font-semibold pl-6"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Primary Email</label>
                  <Input 
                    value={generalData.email} 
                    onChange={e => setGeneralData({ ...generalData, email: e.target.value })}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Phone Coordinate</label>
                  <Input 
                    value={generalData.phone} 
                    onChange={e => setGeneralData({ ...generalData, phone: e.target.value })}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Geographic Location</label>
                  <Input 
                    value={generalData.location} 
                    onChange={e => setGeneralData({ ...generalData, location: e.target.value })}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Personal Website URL</label>
                  <Input 
                    value={generalData.website} 
                    onChange={e => setGeneralData({ ...generalData, website: e.target.value })}
                    className="text-xs h-9 font-semibold"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Social Links channels */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Channels</CardTitle>
              <CardDescription>Integrate external links for social discovery indexing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-mute font-bold uppercase">LinkedIn</span>
                  <Input 
                    value={generalData.linkedin} 
                    onChange={e => setGeneralData({ ...generalData, linkedin: e.target.value })}
                    className="text-xs h-8"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-mute font-bold uppercase">GitHub</span>
                  <Input 
                    value={generalData.github} 
                    onChange={e => setGeneralData({ ...generalData, github: e.target.value })}
                    className="text-xs h-8"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-mute font-bold uppercase">Twitter (X)</span>
                  <Input 
                    value={generalData.twitter} 
                    onChange={e => setGeneralData({ ...generalData, twitter: e.target.value })}
                    className="text-xs h-8"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right side selectors - Timezone, Language, Status */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-text-main">Localization Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">Preferred Language</label>
                <select 
                  value={generalData.language}
                  onChange={e => setGeneralData({ ...generalData, language: e.target.value })}
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-semibold text-text-sub outline-none focus:border-primary/50"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Español</option>
                  <option>Deutsch</option>
                  <option>Français</option>
                  <option>日本語</option>
                  <option>Mandarin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-text-sub font-black uppercase tracking-wider">System Timezone</label>
                <select 
                  value={generalData.timezone}
                  onChange={e => setGeneralData({ ...generalData, timezone: e.target.value })}
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-semibold text-text-sub outline-none focus:border-primary/50"
                >
                  <option value="America/New_York">UTC-5 (New York / EST)</option>
                  <option value="America/Los_Angeles">UTC-8 (Los Angeles / PST)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="Europe/London">UTC+0 (London / GMT)</option>
                  <option value="Europe/Paris">UTC+1 (Paris / CET)</option>
                  <option value="Asia/Shanghai">UTC+8 (Beijing / CST)</option>
                  <option value="Asia/Tokyo">UTC+9 (Tokyo / JST)</option>
                </select>
              </div>

            </CardContent>
          </Card>

          {/* Quick Stats Node Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-text-main flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Active Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] leading-relaxed font-semibold text-text-mute flex flex-col gap-2.5 pt-2">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span>Verification State:</span>
                <Badge variant="neutral" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[8px] font-black">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span>Current IP Route:</span>
                <span className="font-mono text-text-sub">127.0.0.1 (Reverse-Proxy)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SaaS Node:</span>
                <span className="font-mono text-primary font-black">Node 3000 Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Save Row */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button variant="outline" size="sm" onClick={handleReset} className="font-bold text-xs h-9">
          Cancel & Reset
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary text-black font-black text-xs h-9"
        >
          {isSaving ? 'Synchronizing...' : 'Save General Settings'}
        </Button>
      </div>

    </div>
  );
};
