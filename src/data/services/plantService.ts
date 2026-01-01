import { ENV } from '@config/environments';
import { PlantData, Species } from '@models/PlantData';

const ENDPOINTS = {
    GREENHOUSE: '/plants-greenhouse/me',
    CATALOG: '/plants-catalog',
};

export const getGreenhousePlants = async (): Promise<PlantData[] | null> => {
    try {
        const response = await fetch(`${ENV.API_URL}${ENDPOINTS.GREENHOUSE}`);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.log("[Service] Error en Greenhouse API. Modo offline.");
        return null;
    }
};

export const getAllSpecies = async (): Promise<Species[] | null> => {
    try {
        const response = await fetch(`${ENV.API_URL}${ENDPOINTS.CATALOG}`);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.log("[Service] Error en Catalog API. Modo offline.");
        return null;
    }
};