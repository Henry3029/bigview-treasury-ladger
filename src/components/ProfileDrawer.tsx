'use client';
import { X, Zap, Camera, User, ExternalLink, ShieldCheck, Copy, LoaderCircle, LogOut, Wallet } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { uploadImageToImgbb } from '@/utils/uploadImage';

export default function ProfileDrawer({ isOpen, onClose, avatarUrl, 
  setAvatarUrl }: { isOpen: boolean, onClose: () => void, avatarUrl: string | null, // The value
  setAvatarUrl: (url: string | null) => void }) {
  	
  const { authenticated, user, logout, ready } = usePrivy();
  const googleImage = user?.linkedAccounts?.find((acc): acc is any => acc.type === 'google_oauth')?.picture;
  const { wallets } = useWallets();
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const notify = (msg: string) => {
  setMessage(msg);
  setTimeout(() => setMessage(null), 3000);
};

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
    if (uploadedUrl) {
setAvatarUrl(uploadedUrl);
notify('Profile Updated!');
}
    event.target.value = '';
  };

  const copyAddress = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      notify('Address Copied!');
    }
  };

  if (!isOpen) return null;

  return (
  <>
  /* 1. FULL-SCREEN TAKEOVER: Using Bigview Violet background */
  <div className="fixed inset-0 z-[300] bg-charcaol flex flex-col animate-in slide-in-from-right duration-500 font-inter overflow-hidden">
    
    {/* TOAST NOTIFICATION: Gold and Violet styled */}
    {message && (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] animate-in fade-in slide-in-from-top-4">
        <div className="bg-light-green text-text-color text-[10px] font-black tracking-tight px-6 py-2 rounded-bigview shadow-2xl border border-white/10">
          {message}
        </div>
      </div>
    )}
      
    {/* Brand Decorative Background Glows */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-color-white/10 rounded-full blur-[100px] -mr-32 -mt-32" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-color-white/5 rounded-full blur-[100px] -ml-32 -mb-32" />

    {/* HEADER */}
    <div className="relative z-10 p-4 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-color-white tracking-tighter ">Profile</h2>
      </div>
      <button 
        onClick={onClose} 
        className="p-3 bg-charcaol/5 hover:bg-gold-background/50 rounded-bigview text-color-white transition-all active:scale-90"
      >
        <X size={22} />
      </button>
    </div>
      
    {/* AVATAR SECTION */}
    <div className="relative z-10 flex flex-col items-center py-12 px-6">
      <div className="relative">
        <div className="w-28 h-28 rounded-bigview border-4 border-white/5 shadow-2xl bg-charcaol/20 flex items-center justify-center overflow-hidden relative">
           {isUploading ? (
  <LoaderCircle className="w-12 h-12 text-gold-buttons animate-spin" />
) : (avatarUrl || googleImage) ? ( // Use googleImage here
  <img 
    src={avatarUrl || googleImage} 
    alt="Avatar" 
    className="w-full h-full object-cover" 
  />
) : (
  <div className="flex flex-col items-center opacity-20">
    <User size={48} className="text-white" />
  </div>
)}
        </div>

        {/* Camera Button: Bigview Gold */}
        <button 
          onClick={handleCameraClick}
          disabled={isUploading}
          className="absolute bottom-0 left-0 w-full h-1/4 bg-gold-buttons text-text-color font-bold text-xs flex items-center justify-center active:scale-95 transition-all">
        
          <Camera size={18} />
        </button>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>

      <h3 className="mt-6 font-black text-2xl text-color-white tracking-tighter">
        {authenticated ? "Henry Chigozie" : "Guest User"}
      </h3>
      
      {/* Network Badge: Violet and Gold themed */}
      <div className="mt-2 px-4 py-1.5 bg-gold-buttons/10 rounded-bigview border border-gold-buttons/20 flex items-center gap-2">
         <div className="w-1.5 h-1.5 bg-gold-buttons rounded-full animate-pulse shadow-[0_0_8px_#ffd700]"></div>
         <p className="text-[10px] font-black text-color-white tracking-tight">Base Sepolia Live</p>
      </div>
    </div>

    {/* INFO CARDS: Transparent Glass style */}
    <div className="relative z-10 flex-1 overflow-y-auto px-6 space-y-4 pb-10">
      
      <div className="p-4 rounded-bigview border border-color-white/5 bg-light-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-glow/10 rounded-bigview">
              <Wallet size={16} className="text-electric-yellow" />
            </div>
            <p className="text-sm font-bold text-color-white tabular-nums tracking-tight">
              {activeAddress ? `${activeAddress.slice(0, 10)}...${activeAddress.slice(-8)}` : 'Not Connected'}
            </p>
          </div>
          <button onClick={copyAddress} className="p-2 text-color-white/40 hover:text-gold-buttons transition-colors">
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="p-5 rounded-bigview border border-white/5 bg-color-ash/[0.03] backdrop-blur-md">
        <p className="text-[9px] font-black text-color-white/40 tracking-tight mb-3">Membership Tier</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-color-ash/10 rounded-bigview">
              <ShieldCheck size={16} className="text-gold-buttons" />
            </div>
            <span className="text-xs font-black text-gold-buttons">Tier 1 • Genesis</span>
          </div>
          <button className="text-[10px] font-black text-color-white/60 hover:text-gold-buttons flex items-center gap-1 transition-colors">
            Upgrade <ExternalLink size={12}/>
          </button>
        </div>
      </div>

      <div className="pt-6 space-y-3">
         <button className="w-full flex items-center justify-between p-5 rounded-bigview bg-color-ash/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
            <div className="flex items-center gap-4">
               <Zap size={18} className="text-gold-buttons" />
               <span className="text-sm font-bold text-white/80">Stake Assets</span>
            </div>
            <X size={16} className="text-white/20 rotate-45" />
         </button>

         {authenticated && (
           <button 
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center gap-4 p-5 rounded-bigview bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all"
           >
             <LogOut size={18} />
             <span className="text-sm font-bold">Disconnect Wallet</span>
           </button>
         )}
      </div>
    </div>

    {/* FOOTER */}
    <div className="relative z-10 p-10 border-t border-white/5 text-center">
       <p className="text-[10px] font-black text-white/20 tracking-tight">
         Bigview Treasury Ledger • v2.0
       </p>
    </div>
  </div>
  </>
);
}