import { ENV } from '@config/environments';
import { PlantData } from '@models/PlantData';

const RESOURCE = '/plants-greenhouse';

export const getPlantsFromCloud = async (): Promise<PlantData[] | null> => {
    try {
        const response = await fetch(`${ENV.API_URL}${RESOURCE}`);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`[Service Error] Fallo al conectar con ${RESOURCE}. Modo offline activado.`);
        return null;
    }
};