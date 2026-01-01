import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Species, DEFAULT_SPECIES } from '@models/PlantData';
import { getAllSpecies } from '@services/plantService';

const CATALOG_CACHE_KEY = '@SIIT40_catalog_cache';

export const useSpeciesCatalog = () => {
    const [species, setSpecies] = useState<Species[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCatalog = useCallback(async () => {
        setLoading(true);
        const cloudSpecies = await getAllSpecies();

        let finalCatalog: Species[] = [];

        if (cloudSpecies) {
            finalCatalog = cloudSpecies;
            await AsyncStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(cloudSpecies));
        } else {
            const cached = await AsyncStorage.getItem(CATALOG_CACHE_KEY);
            finalCatalog = cached ? JSON.parse(cached) : [];
        }
        setSpecies([DEFAULT_SPECIES, ...finalCatalog]);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadCatalog();
    }, [loadCatalog]);

    return { species, loading, refetch: loadCatalog };
};