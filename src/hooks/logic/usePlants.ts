import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantData } from '@models/PlantData';
import { getGreenhousePlants } from '@services/plantService';

const STORAGE_KEY = '@plants_inventory_cache';

export const usePlants = () => {
    const [plants, setPlants] = useState<PlantData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        
        const cloudData = await getGreenhousePlants();

        if (cloudData) {
            setPlants(cloudData);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        } else {
            const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (cachedData) {
                setPlants(JSON.parse(cachedData));
            } else {
                setPlants([]);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { plants, loading, refetch: loadData };
};