'use client';
import React from 'react';
import { CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'pending';
  time: string;
}

export default function NotificationDropdown({ 
  isOpen, 
  onClose, 
  notifications 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: Notification[];
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] animate-in fade-in zoom-in duration-200">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-50 flex items-center justify-between">
        <span className="font-black text-xs uppercase tracking-widest text-slate-900">Notifications</span>
        <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
          <X size={16} />
        </button>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {n.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
                  {n.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
                  {n.type === 'pending' && <Clock size={18} className="text-amber-500 animate-pulse" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.description}</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase mt-2 tracking-tighter">{n.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <p className="text-xs font-bold text-slate-400 italic">No new activity</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 bg-slate-50/50 rounded-b-2xl text-center">
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
          Mark all as read
        </button>
      </div>
    </div>
  );
}