'use client';

interface ProtocolCard {
  name: string;
  category: string;
  booster: string;
  desc: string;
  actionText: string;
  url: string;
  logo: string; // Emoji placeholder or path to an icon
}

export default function DefiOpportunities() {
  // Hardcoded real-world Base protocols mirroring the StackingDAO style layout
  const protocols: ProtocolCard[] = [
    {
      name: "Aerodrome Finance",
      category: "DEX / LP",
      booster: "150%",
      desc: "Provide liquidity to the cbETH-ETH stable pool. Earn continuous swap fees and premium multiplier rewards.",
      actionText: "Add Liquidity",
      url: "https://aerodrome.finance",
      logo: "✈️"
    },
    {
      name: "Aave V3",
      category: "Lending Market",
      booster: "50%",
      desc: "Supply your cbETH as collateral into institutional-grade liquidity pools to earn automated passive lending yield.",
      actionText: "Supply Assets",
      url: "https://aave.com",
      logo: "👻"
    },
    {
      name: "Seamless Protocol",
      category: "Leverage / CDP",
      booster: "100%",
      desc: "Lock your assets to borrow or automatically multiply your staking yields through Integrated Liquidity Markets.",
      actionText: "Open Strategy",
      url: "https://seamlessprotocol.com",
      logo: "🌐"
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1 text-gray-950 dark:text-white">
          DeFi Integration Hub
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Deploy your assets across the Base network ecosystem to accelerate your points accumulation.
        </p>
      </div>

      {/* Grid container matching the vertical list style layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {protocols.map((app) => (
          <div 
            key={app.name} 
            className="flex flex-col justify-between p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            {/* Top Row: Meta info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl">{app.logo}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20 uppercase tracking-wider">
                  🔥 {app.booster} Boost
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  {app.category}
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {app.desc}
                </p>
              </div>
            </div>

            {/* Bottom Row: Call to Action Link */}
            <div className="mt-6">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-sm font-semibold tracking-wide transition-colors shadow-sm"
              >
                {app.actionText} 
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}