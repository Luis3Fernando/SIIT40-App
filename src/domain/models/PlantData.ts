interface IrrigationRequirements {
    vol: number; 
    freq: number; 
    raw: number;  
}

export interface Species extends IrrigationRequirements {
    speciesId: number | string;
    name: string;
    scientificName: string;
    imageUrl: string;
    color: string;
}

export interface PlantData extends Species {
    id: number;  
    zone: 'Zona A' | 'Zona B';
    stage: 'Reproductivo' | 'Crecimiento' | 'Maduración';
    count: number;
    isCritical: boolean;
    lastWatered?: string; 
}

export const DEFAULT_SPECIES: Species = {
    speciesId: 'default',
    name: 'Especie Genérica',
    scientificName: 'Plantae desconocido',
    imageUrl: 'https://via.placeholder.com/150',
    color: '#D1D1D1',
    vol: 1.0,
    freq: 4,
    raw: 2500,
};