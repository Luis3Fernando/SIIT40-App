import { useState, useEffect } from 'react';
import { esp32Service } from '@services/esp32Service';
import { formatLogName } from '@utils/time';
import { useConnectionGuard } from './useConnectionGuard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogOption {
  id: string;     
  label: string;  
}

export const useHistoryLogs = () => {
  const [logs, setLogs] = useState<LogOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useConnectionGuard();

  const fetchLogs = async () => {
    setLoading(true);
    let rawFiles: string[] = [];

    if (isConnected) {
      const result = await esp32Service.fetchHistoryFiles();
      if (!('type' in result)) {
        rawFiles = result.files;
        await AsyncStorage.setItem('@available_logs', JSON.stringify(rawFiles));
        }
    } else {
      const saved = await AsyncStorage.getItem('@available_logs');
      if (saved) rawFiles = JSON.parse(saved);
    }

    const formattedLogs = rawFiles.map(file => ({
      id: file,
      label: formatLogName(file)
    }));

    setLogs(formattedLogs);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [isConnected]);

  return { logs, loading, refetch: fetchLogs };
};