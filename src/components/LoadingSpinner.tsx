export default function LoadingSpinner() {
  return (
  /* 1. Backdrop: Using a deeper, brand-aligned blur with your violet base */
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-violet-background/80 backdrop-blur-md">
    <div className="flex flex-col items-center gap-6">
      
      {/* Bigview Spinning Ring: Using Violet Glow and Gold accents */}
      <div className="relative w-16 h-16">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 border-4 border-violet-glow/20 rounded-full"></div>
        {/* Active Spinning Segment */}
        <div className="absolute inset-0 border-4 border-t-gold-buttons rounded-full animate-spin"></div>
      </div>

      {/* Loading Text: Using your italicized font-black style */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-gold-buttons font-black uppercase italic tracking-[0.2em] animate-pulse">
          Loading Treasury
        </p>
        <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
          Syncing with Base Sepolia
        </span>
      </div>

    </div>
  </div>
);
}