export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Modern Spinning Ring */}
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-900 font-bold animate-pulse">Loading Treasury...</p>
      </div>
    </div>
  );
}