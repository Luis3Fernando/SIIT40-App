import { useState, useCallback } from 'react';
import { esp32Service } from '@services/esp32Service';
import { AppFailure } from '@errors/Failures';
import { useConnectionGuard } from './useConnectionGuard';

export interface StatusResponse {
  sd_total_mb: number;
  sd_usado_mb: number;
  sd_libre_pct: number;
  wifi_rssi: number;
  uptime_seg: number;
}

export const useEsp32Status = () => {
  const [hwStatus, setHwStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected } = useConnectionGuard();

  const fetchHardwareStatus = useCallback(async () => {
    if (!isConnected) {
      setError("Sin conexión Wi-Fi al SIIT40");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await esp32Service.fetchHardwareStatus(); 

      if (result && !('type' in result)) {
        setHwStatus(result as StatusResponse);
      } else {
        setError("El ESP32 no respondió a la solicitud de estado.");
      }
    } catch (e) {
      setError("Error crítico de comunicación");
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  return { hwStatus, loading, error, refetch: fetchHardwareStatus };
};