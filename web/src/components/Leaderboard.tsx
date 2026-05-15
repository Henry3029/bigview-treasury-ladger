'use client';
import { useState, useMemo } from 'react';

// Mock Interface for Type Safety
interface LeaderboardUser {
  rank: number;
  address: string;
  totalPoints: number;
  deployedInDeFi: number; // formatted string or number representing volume/multiplier
}

export default function Leaderboard() {
  // 1. Search Bar State
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 2. Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Mock Data: In production, you will fetch this from your database/indexer
  const mockUsers: LeaderboardUser[] = useMemo(() => {
    return Array.from({ length: 35 }, (_, index) => ({
      rank: index + 1,
      address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      totalPoints: Math.floor(1000000 / (index + 1)) + (Math.random() * 500),
      deployedInDeFi: parseFloat((Math.random() * 150).toFixed(2))
    }));
  }, []);

  // 3. Search Filter Logic
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return mockUsers;
    return mockUsers.filter(user => 
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mockUsers]);

  // 4. Pagination Calculation Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Handle page switching safely
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-transparent text-gray-800 dark:text-white space-y-6">
      
      {/* Header Text */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard</h1>
        <p className="text-sm text-gray-400">
          A list of users sorted by points earned. Enter an address below to view its information.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-md w-full">
        {/* Search SVG Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="0x..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 on active typing
          }}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-mono placeholder-gray-500 outline-none focus:border-[#B8860B] transition-all"
        />
      </div>

      {/* Table Section: Horizontal scroll activated via overflow-x-auto */}
      <div className="w-full overflow-x-auto border border-white/10 rounded-2xl bg-white/5 shadow-md">
        <table className="w-full min-w-[600px] text-left border-collapse">
          
          {/* Table Header Setup */}
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <th className="py-4 px-6 text-left">Rank</th>
              <th className="py-4 px-6 text-left">User</th>
              <th className="py-4 px-6 text-right">Deployed in DeFi</th>
              <th className="py-4 px-6 text-right">Total Points</th>
            </tr>
          </thead>

          {/* Table Body (Data Render Engine) */}
          <tbody className="divide-y divide-white/5 font-medium text-sm">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user.rank} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-left font-mono">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                  </td>
                  <td className="py-4 px-6 text-left font-mono text-[#B8860B]">
                    {user.address}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">
                    {user.deployedInDeFi} ETH
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-white">
                    {Math.floor(user.totalPoints).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center font-medium text-gray-500">
                  No matching wallet address found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Controls Engine */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          {/* Left Arrow Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
          >
            ←
          </button>

          {/* Core Page Indicators */}
          <div className="flex gap-2 text-sm font-medium">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === pageNumber
                    ? 'bg-[#B8860B] text-black font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}