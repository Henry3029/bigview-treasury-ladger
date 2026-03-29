'use client';
import { X, Copy, Zap, Camera, User, ExternalLink, LoaderCircle, LogOut, ShieldCheck, Wallet } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { uploadImageToImgbb } from '@/utils/uploadImage';

export default function ProfileDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { authenticated, user, logout, ready } = usePrivy();
  const { wallets } = useWallets();
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const walletAddress = wallets[0]?.address || user?.wallet?.address;
    if (authenticated && walletAddress) {
      setActiveAddress(walletAddress);
    } else {
      setActiveAddress(null);
    }
  }, [authenticated, wallets, user]);

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) return;
    
    setIsUploading(true);
    const uploadedUrl = await uploadImageToImgbb(file);
    setIsUploading(false);
    if (uploadedUrl) setAvatarUrl(uploadedUrl);
    event.target.value = '';
  };

  const copyAddress = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      alert('Address copied!');
    }
  };

  if (!isOpen) return null;

  return (
    // 1. FULL-SCREEN TAKEOVER: Using the Bigview Dark aesthetic
    <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-500 font-inter">
      
      {/* Decorative Background Glows (OPay Style) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

      {/* HEADER */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <User size={20} className="text-white/60" />
          </div>
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Account</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* AVATAR SECTION */}
      <div className="relative z-10 flex flex-col items-center py-12 px-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] border-4 border-white/5 shadow-2xl bg-slate-900 flex items-center justify-center overflow-hidden relative">
             {isUploading ? (
                <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
             ) : avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <div className="flex flex-col items-center opacity-20">
                  <User size={48} className="text-white" />
                </div>
             )}
          </div>

          <button 
            onClick={handleCameraClick}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-blue-600 text-white shadow-xl border-4 border-slate-950 active:scale-90 transition-all"
          >
            <Camera size={18} />
          </button>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        <h3 className="mt-6 font-black text-2xl text-white italic tracking-tighter uppercase">
          {authenticated ? "Henry Chigozie" : "Guest User"}
        </h3>
        
        <div className="mt-2 px-4 py-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Base Sepolia Live</p>
        </div>
      </div>

      {/* INFO CARDS: Dark Fintech Style */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 space-y-4 pb-10">
        
        <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-md">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Wallet Controller</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Wallet size={16} className="text-blue-500" />
              </div>
              <p className="text-sm font-bold text-white tabular-nums tracking-tight">
                {activeAddress ? `${activeAddress.slice(0, 10)}...${activeAddress.slice(-8)}` : 'Not Connected'}
              </p>
            </div>
            <button onClick={copyAddress} className="p-2 text-slate-500 hover:text-white transition-colors">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-md">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Membership Tier</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <span className="text-xs font-black text-emerald-500 uppercase italic">Tier 1 • Genesis</span>
            </div>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
              Upgrade <ExternalLink size={12}/>
            </button>
          </div>
        </div>

        <div className="pt-6 space-y-3">
           <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
              <div className="flex items-center gap-4">
                 <Zap size={18} className="text-blue-500" />
                 <span className="text-sm font-bold text-slate-200">Stake Assets</span>
              </div>
              <X size={16} className="text-slate-600 rotate-45" />
           </button>

           {authenticated && (
             <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all"
             >
               <LogOut size={18} />
               <span className="text-sm font-bold">Sign Out Session</span>
             </button>
           )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 p-10 border-t border-white/5 text-center">
         <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
           Bigview Treasury Ledger • v1.0
         </p>
      </div>
    </div>
  );
}