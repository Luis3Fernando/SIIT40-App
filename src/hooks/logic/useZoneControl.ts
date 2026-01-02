import { useState } from 'react';
import { setZoneStatus } from '@services/esp32Service';

export const useZoneControl = (id: 'A' | 'B', initialStatus: boolean) => {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = !isActive;
    const success = await setZoneStatus(id, newStatus);
    
    if (success) {
      setIsActive(newStatus);
    } else {
    }
    setLoading(false);
  };

  return { isActive, toggleStatus, loading };
};