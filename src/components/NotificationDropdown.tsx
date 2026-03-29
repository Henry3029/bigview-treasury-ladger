'use client';
import React from 'react';
import { CheckCircle2, AlertCircle, Clock, X, Bell, Trash2 } from 'lucide-react';

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
    // 1. THE FULL-SCREEN OVERLAY: Dark & Blurred like the OPay pop-ups
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md animate-in slide-in-from-bottom-full duration-500 font-inter">
      
      <div className="flex flex-col h-full w-full max-w-lg mx-auto">
        
        {/* 2. THE HEADER: Aggressive Fintech Style */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-xl">
              <Bell size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Activity</h2>
              <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Bigview Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* 3. NOTIFICATION LIST: High-Contrast Dark Theme */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-3xl hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {n.type === 'success' && <CheckCircle2 size={22} className="text-emerald-500" />}
                    {n.type === 'error' && <AlertCircle size={22} className="text-red-500" />}
                    {n.type === 'pending' && <Clock size={22} className="text-blue-500 animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[13px] font-black text-white italic uppercase tracking-tight">{n.title}</p>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-3">
                      {n.description}
                    </p>
                    {/* Tiny network badge */}
                    <span className="text-[8px] font-black text-blue-500/50 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                      Base Sepolia
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Bell size={32} className="text-slate-500" />
              </div>
              <p className="text-sm font-black text-slate-500 italic uppercase tracking-widest">No New Activity</p>
            </div>
          )}
        </div>

        {/* 4. THE FOOTER: Floating Action */}
        <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-xl">
          <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Clear All History
          </button>
        </div>
      </div>
    </div>
  );
}