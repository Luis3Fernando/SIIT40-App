import { SensorData } from '@models/SensorData';
import { useMemo } from 'react';

export const useLogProcessor = (data: SensorData[], metric: keyof SensorData) => {
  return useMemo(() => {
    if (data.length === 0) return { max: 0, min: 0, avg: 0 };
    const values = data
      .map(item => item[metric])
      .filter((v): v is number => typeof v === 'number');

    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      max: max.toFixed(1),
      min: min.toFixed(1),
      avg: avg.toFixed(1)
    };
  }, [data, metric]);
};