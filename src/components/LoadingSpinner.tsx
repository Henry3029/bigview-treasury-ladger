export default function LoadingSpinner() {
  return (
  /* 1. Backdrop: Using a deeper, brand-aligned blur with your violet base */
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-violet-background/80 backdrop-blur-md">
    <div className="flex flex-col items-center gap-6">
      
      {/* Bigview Spinning Ring: Using Violet Glow and Gold accents */}
      <div className="w-12 h-12 border-4 border-violet-glow/20 border-t-gold-buttons border-r-transparent rounded-full animate-spin"></div>

      {/* Loading Text: Using your italicized font-black style */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-gold-buttons font-black tracking-[0.2em] animate-pulse">
          BigView
        </p>
      </div>

    </div>
  </div>
);
}