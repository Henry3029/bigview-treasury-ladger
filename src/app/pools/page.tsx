// src/app/pools/page.tsx
import AddLiquidity from '@/components/AddLiquidity';

export default function PoolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 1. Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Liquidity Pools</h1>
        <p className="text-slate-500 font-medium">Deposit your assets to earn a share of trading fees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Pool List (Left Side - 2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Available Pools</h3>
            {/* You would map through your pools here */}
            <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition cursor-pointer border border-transparent hover:border-orange-100">
               <div className="flex gap-3 items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="font-bold text-slate-700">STX / USDA</span>
               </div>
               <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Estimated APY</p>
                  <p className="text-green-500 font-black">12.4%</p>
               </div>
            </div>
          </div>
        </div>

        {/* 3. Action Sidebar (Right Side - 1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <AddLiquidity /> 
             <p className="mt-4 text-[10px] text-slate-400 px-4">
               Note: Adding liquidity exposes you to impermanent loss. Ensure you understand the risks before proceeding.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}