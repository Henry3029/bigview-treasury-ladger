export const RewardHistory = () => {
  const history = [
    { id: 1, date: 'Oct 24', amount: '+2.50 STX', status: 'Received' },
    { id: 2, date: 'Oct 10', amount: '+2.45 STX', status: 'Received' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-gray-800 font-bold px-1">Recent Activity</h3>
      {history.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              ↓
            </div>
            <div>
              <p className="font-semibold text-gray-800">{item.status}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
          </div>
          <p className="font-bold text-green-600">{item.amount}</p>
        </div>
      ))}
    </div>
  );
};