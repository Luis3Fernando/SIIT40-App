import { useEffect, useState, useCallback } from 'react';
import { getCurrentStatus } from '@usecases/getCurrentStatus';
import { SensorData } from '@models/SensorData';
import { AppFailure } from '@errors/Failures';

export const useRealTimeStatus = (pollingInterval = 15000) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [error, setError] = useState<AppFailure | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    const result = await getCurrentStatus();

    if ('type' in result) {
      setError(result);
    } else {
      setData(result);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, pollingInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, pollingInterval]);

  return { data, error, loading, refetch: fetchData };
};