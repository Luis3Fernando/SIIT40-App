import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentStatus } from '@usecases/getCurrentStatus';
import { useDispatch } from 'react-redux';
import { setApiStatus } from '@redux/slices/connectionSlice';
import { SensorData } from '@models/SensorData'; // IMPORTANTE: Usar el modelo de dominio

export interface DashboardData {
  temperature: number | null;
  airHumidity: number | null;
  co2: number | null;
  soilMoisture: number | null;
  light: number | null;
  species: number;
}

const STORAGE_KEY = '@last_telemetry_data';

export const useRealTimeStatus = (pollingInterval = 15000) => {
  const [displayData, setDisplayData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  // Ahora procesamos SensorData[], no DTOs
  const processAverages = (nodes: SensorData[]): DashboardData => {
    // Filtramos nodos que tengan datos válidos
    const activeNodes = nodes.filter(n => n.mensajeEstado === "Lectura Exitosa");
    
    if (activeNodes.length === 0) {
      return { temperature: null, airHumidity: null, co2: null, soilMoisture: null, light: null, species: 0 };
    }

    const calcMean = (key: keyof SensorData) => {
      const sum = activeNodes.reduce((acc, curr) => acc + (curr[key] as number), 0);
      return parseFloat((sum / activeNodes.length).toFixed(1));
    };

    return {
      temperature: calcMean('temperatura'),
      airHumidity: calcMean('humedadAmbiente'),
      co2: calcMean('co2'),
      soilMoisture: calcMean('humedadSuelo'),
      light: calcMean('lux'),
      species: 0,
    };
  };

  const fetchData = useCallback(async () => {
    try {
      const result = await getCurrentStatus();
      if (Array.isArray(result)) {
        const averaged = processAverages(result);
        setDisplayData(averaged);
        dispatch(setApiStatus(true));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(averaged));
      } else {
        throw new Error("Petición fallida");
      }
    } catch (err) {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        setDisplayData(JSON.parse(cached));
      }
      dispatch(setApiStatus(false));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (pollingInterval <= 0) {
      AsyncStorage.getItem(STORAGE_KEY).then(cached => {
        if (cached) setDisplayData(JSON.parse(cached));
        setLoading(false);
      });
      return;
    }

    fetchData(); 
    const intervalId = setInterval(fetchData, pollingInterval);
    return () => clearInterval(intervalId); 
  }, [pollingInterval, fetchData]);

  return { data: displayData, loading, refetch: fetchData };
};