import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'; 
import { RootState } from '@redux/store';
import { setInventory, addPlantToInventory } from '@redux/slices/plantsSlice';
import { PlantData } from '@models/PlantData';
import { getGreenhousePlants } from '@services/plantService';

const STORAGE_KEY = '@plants_inventory_cache';

export const usePlants = () => {
    const dispatch = useDispatch();
    const plants = useSelector((state: RootState) => state.plants.inventory);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const cloudData = await getGreenhousePlants();

            if (cloudData) {
                dispatch(setInventory(cloudData));
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
            } else {
                const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
                const localData: PlantData[] = cachedData ? JSON.parse(cachedData) : [];
                dispatch(setInventory(localData));
            }
        } catch (error) {
            console.error("[usePlants] Error cargando inventario:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const addPlantLocal = async (newPlant: PlantData) => {
        try {
            dispatch(addPlantToInventory(newPlant));
            const updatedPlants = [...plants, newPlant];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
            
            console.log("[Storage] Inventario y Redux actualizados localmente.");
        } catch (e) {
            console.error("[usePlants] Error al guardar localmente:", e);
        }
    };

    useEffect(() => {
        if (plants.length === 0) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [loadData, plants.length]);

    return { 
        plants, 
        loading, 
        refetch: loadData, 
        addPlantLocal 
    };
};