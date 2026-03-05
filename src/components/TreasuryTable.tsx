// src/components/TreasuryTable.tsx
export default function TreasuryTable({ transactions }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (STX)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward (BTC)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
              <td className="px-6 py-4">{tx.type}</td>
              <td className="px-6 py-4 font-mono">{tx.stxAmount}</td>
              <td className="px-6 py-4 font-mono text-orange-600">{tx.btcReward}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}