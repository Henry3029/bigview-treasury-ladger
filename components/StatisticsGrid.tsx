// We tell the component to expect "totalStaked" and "apy" as inputs (props)
export const StatisticsGrid = ({ totalStaked, apy }: { totalStaked: string, apy: string }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs italic font-medium">Pool APY</p>
        {/* Now it shows the variable instead of just "9.5%" */}
        <p className="text-xl font-bold text-green-600">{apy}%</p>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs italic font-medium">Total Staked</p>
        {/* This will show the real number from your contract */}
        <p className="text-xl font-bold text-gray-800">{totalStaked} STX</p>
      </div>
    </div>
  );
};