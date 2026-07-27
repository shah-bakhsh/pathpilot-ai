/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle } from 'lucide-react';
import { CalendarComponent } from './execution/CalendarComponent';
import { Badge } from '../ui/Badge';
import { useCareer } from '../../contexts/CareerContext';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, toggleCalendarEvent } = useCareer();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Career Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Calendar & Deadlines</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" /> Career Scheduler & Deadlines
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Organize interview schedules, application deadlines, milestone target dates, and daily study blocks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="primary" className="text-xs font-black py-1 px-3">
            {calendarEvents.length} Scheduled Events
          </Badge>
        </div>
      </div>

      {/* Main Calendar Component */}
      <div className="w-full">
        <CalendarComponent
          events={calendarEvents}
          onAddEvent={addCalendarEvent}
          onToggleEventComplete={toggleCalendarEvent}
          onDeleteEvent={() => {}}
        />
      </div>
    </div>
  );
};

export default CalendarView;
