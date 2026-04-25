import React, { useState } from 'react';
import MobileHeader from './MobileHeader';
import NotificationDropdown from './NotificationDropdown';

export default function MobileHeaderWrapper() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <MobileHeader onNotificationClick={() => setIsNotifOpen(true)} />
      
      <NotificationDropdown 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </>
  );
}