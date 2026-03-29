// ... (Keep all your existing imports and logic/hooks) ...

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24 flex flex-col gap-6 max-w-2xl mx-auto font-inter">
      
      {/* Identity Header: Swapped blue circle for sleek avatar */}
      <div className="flex items-center gap-4 p-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-white shadow-sm overflow-hidden">
            {user?.google?.picture ? (
               <img src={user.google.picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} strokeWidth={1.5} />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-50 shadow-sm" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Treasury Profile</h2>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 mt-0.5 text-[10px] text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-widest hover:bg-blue-100 transition-colors"
          >
            {truncatedAddress}
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </button>
        </div>
      </div>

      {/* Wallet Balance Card: Fixed corners to rounded-3xl and cleaned up layout */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group border border-white/5">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black">Available Balance</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black italic tracking-tighter tabular-nums">
              {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : "0.0000"}
            </h3>
            <span className="text-blue-500 font-black text-lg italic uppercase tracking-tighter">ETH</span>
          </div>
          
          <div className="mt-6 flex gap-3">
            <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[8px] font-black text-blue-400/60 uppercase tracking-widest mb-0.5">Network</p>
              <p className="text-[10px] font-bold text-white uppercase tracking-tight">Base Sepolia</p>
            </div>
            <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[8px] font-black text-blue-400/60 uppercase tracking-widest mb-0.5">Provider</p>
              <p className="text-[10px] font-bold text-white uppercase tracking-tight">{user?.linkedAccounts[0]?.type || 'Wallet'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions List: Updated with rounded-3xl and better spacing */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <a 
          href={`https://sepolia.basescan.org/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <ExternalLink size={20} />
            </div>
            <div>
              <span className="font-black text-slate-800 text-sm block italic uppercase tracking-tight">Basescan Explorer</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">View On-Chain Activity</span>
            </div>
          </div>
          <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <button 
          onClick={() => logout()}
          className="p-5 flex items-center justify-between hover:bg-red-50 text-red-500 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <LogOut size={20} />
            </div>
            <div>
              <span className="font-black text-sm block italic uppercase tracking-tight">Disconnect Wallet</span>
              <span className="text-[9px] font-bold text-red-300 uppercase tracking-widest">End Session Safely</span>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center pt-4 opacity-20">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Bigview Protocol • v1.0</p>
      </div>
    </main>
  );
}