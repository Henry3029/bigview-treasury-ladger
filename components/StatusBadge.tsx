// src/components/StatusBadge.tsx
import React from 'react';

// 1. Define the possible status types
type DashboardStatus = 'online' | 'pending' | 'error';

interface StatusBadgeProps {
  status: DashboardStatus;
  label?: string; // Optional custom text
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  // 2. Map status to specific Tailwind colors and icons
  const statusConfig = {
    online: {
      color: 'bg-green-100 text-green-700 border-green-200',
      dot: 'bg-green-500',
      text: label || 'System Operational'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dot: 'bg-yellow-500',
      text: label || 'Syncing Blocks...'
    },
    error: {
      color: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500',
      text: label || 'Wallet Disconnected'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      {/* Visual indicator dot with a pulse effect for 'online' */}
      <span className={`mr-2 h-2 w-2 rounded-full ${config.dot} ${status === 'online' ? 'animate-pulse' : ''}`}></span>
      {config.text}
    </div>
  );
}
