/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CalendarDays, Plus, Clock, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface CalendarComponentProps {
  events: any[];
  onAddEvent: (event: any) => void;
  onToggleEventComplete: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onAddEvent,
  onToggleEventComplete,
  onDeleteEvent
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', type: 'deadline' as any, date: new Date().toISOString().split('T')[0],
    completed: false, priority: 'medium' as any
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Get first day and number of days of selected month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Selected date string
  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay || 1).padStart(2, '0')}`;

  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    onAddEvent({
      ...newEvent,
      id: 'evt_' + Math.random().toString(36).substring(2, 9)
    });
    setIsAdding(false);
    setNewEvent({
      title: '', type: 'deadline', date: selectedDateStr, completed: false, priority: 'medium'
    });
  };

  // Days mapping
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
      
      {/* Monthly grid */}
      <Card className="xl:col-span-2 bg-slate-900/20 border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{monthNames[currentMonth]} {currentYear}</h3>
          <div className="flex items-center gap-1.5">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {blankDays.map(b => (
            <div key={`b_${b}`} className="aspect-square bg-transparent" />
          ))}

          {daysArray.map(day => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvts = events.filter(e => e.date === dateStr);
            const isSelected = selectedDay === day;
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl p-1 border flex flex-col justify-between transition-all relative ${
                  isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-900 bg-slate-950/40 hover:bg-slate-900/40'
                }`}
              >
                <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-400 font-extrabold' : isSelected ? 'text-white' : 'text-slate-400'}`}>
                  {day}
                </span>

                {/* Event dots */}
                <div className="flex gap-0.5 justify-center mt-auto w-full">
                  {dayEvts.slice(0, 3).map((e, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1 h-1 rounded-full ${
                        e.type === 'interview' ? 'bg-indigo-400' : e.type === 'deadline' ? 'bg-rose-400' : 'bg-emerald-400'
                      }`} 
                    />
                  ))}
                  {dayEvts.length > 3 && (
                    <span className="text-[7px] text-slate-400 font-bold leading-none">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Agenda Panel */}
      <Card className="xl:col-span-1 bg-slate-900/20 border-slate-800 flex flex-col justify-between">
        <CardHeader className="border-b border-slate-800/85">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">Selected Day Agenda</h4>
            <span className="text-[10px] text-indigo-400 font-bold">{selectedDateStr}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-none">
            {selectedDayEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-start gap-2">
                  <button 
                    onClick={() => onToggleEventComplete(evt.id)} 
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                      evt.completed ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 hover:border-indigo-500'
                    }`}
                  >
                    {evt.completed && <Check className="w-2.5 h-2.5" />}
                  </button>
                  <div>
                    <span className={`text-xs font-bold leading-normal block ${evt.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {evt.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[8px] font-extrabold uppercase bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5 text-slate-400">{evt.type}</span>
                      <Badge variant={evt.priority === 'high' ? 'error' : evt.priority === 'medium' ? 'warning' : 'neutral'} className="text-[8px] px-1 py-0 scale-90">
                        {evt.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <button onClick={() => onDeleteEvent(evt.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {selectedDayEvents.length === 0 && (
              <p className="text-[10px] text-slate-500 font-bold text-center py-12">No agenda items scheduled for this day.</p>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setNewEvent({ ...newEvent, date: selectedDateStr });
              setIsAdding(true);
            }} 
            className="w-full flex items-center justify-center gap-1.5 mt-2 h-9 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/5"
          >
            <Plus className="w-4 h-4" /> Schedule Agenda Item
          </Button>
        </CardContent>

        {/* Inline Add Event modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <Card className="max-w-md w-full bg-slate-950 border-slate-800">
              <CardHeader className="border-b border-slate-800/80">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-widest">
                  <CalendarDays className="w-4 h-4 text-indigo-400" /> Plan Scheduled Agenda Item
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Agenda Title / Objective"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g. Stripe Technical Interview Prep"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                        className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                      >
                        <option value="deadline">📅 Deadline Target</option>
                        <option value="interview">⚡ Technical Interview</option>
                        <option value="learning_goal">📚 Learning goal</option>
                        <option value="monthly_goal">🎯 Monthly Goal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                      <select
                        value={newEvent.priority}
                        onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                        className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                      >
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Scheduled Date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Schedule Item</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};
