'use client';
import { X, Copy, Zap, ArrowLeftRight, Camera, User, ExternalLink, LoaderCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useState, useRef, ChangeEvent } from 'react';
import { uploadImageToImgbb } from '@/utils/uploadImage'; // Import the new utility

export default function ProfileDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { address } = useAccount();

  // State for the avatar URL and loading status
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the file input when the camera button is clicked
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the file selection and upload
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optional: Basic validation (size, type)
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size exceeds 5MB limit.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Only JPG, PNG, and GIF files are supported.');
      return;
    }

    console.log('Starting upload for:', file.name);
    setIsUploading(true);

    const uploadedUrl = await uploadImageToImgbb(file);

    setIsUploading(false);

    if (uploadedUrl) {
      console.log('Upload successful! Image URL:', uploadedUrl);
      setAvatarUrl(uploadedUrl); // Update the avatar on the screen
      // In a real application, you would also save this URL to your user's profile database.
    } else {
      console.error('Upload failed. Please try again.');
      alert('Image upload failed. Please try again later.');
    }

    // Reset the file input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className={`fixed inset-0 z-[200] ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      <div className={`fixed top-0 bottom-0 right-0 w-[90%] max-w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="p-5 flex items-center gap-4 border-b border-slate-50">
          <button onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-50 transition-colors">
            <X size={24} />
          </button>
          <span className="font-bold text-slate-900 text-lg">My Profile</span>
        </div>
        
        {/* AVATAR SECTION (OPay Style with Upload Logic) */}
        <div className="flex flex-col items-center py-10 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-blue-100">
               {isUploading ? (
                  // Show loading spinner during upload
                  <LoaderCircle className="w-12 h-12 text-blue-600 animate-spin" />
               ) : avatarUrl ? (
                  // Show the new avatar
                  <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
               ) : (
                  // Show the default icon
                  <User size={48} className="text-slate-300" />
               )}
            </div>

            {/* THE CAMERA BUTTON (Clickable Trigger) */}
            <button 
              onClick={handleCameraClick}
              disabled={isUploading}
              className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg active:scale-90 transition-all ${isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              <Camera size={16} />
            </button>

            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          <p className="mt-4 font-black text-xl text-slate-900 tracking-tight">Henry Chigozia</p>
          <div className="mt-1 px-3 py-1 bg-blue-50 rounded-full">
             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Base Sepolia</p>
          </div>
        </div>

        {/* INFO CARDS (Same as before) */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          
          <div className="p-4 rounded-2xl border border-slate-100 bg-white">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wallet Address</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800 tabular-nums">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
              </p>
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Copy size={16} /></button>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-white">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Tier</p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Tier 1 • Genesis</span>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 transition-colors hover:text-blue-800">Upgrade <ExternalLink size={12}/></button>
            </div>
          </div>

          <div className="pt-4 space-y-3">
             <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                   <Zap size={18} className="text-blue-600" />
                   <span className="text-sm font-bold text-slate-700">Stake Assets</span>
                </div>
                <X size={16} className="text-slate-300 rotate-45" />
             </button>
          </div>

        </div>

        <div className="p-8 border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
             Bigview Treasury Ledger v1.0
           </p>
        </div>
      </div>
    </div>
  );
}