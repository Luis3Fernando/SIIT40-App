export type PlantStage = 'Reproductivo' | 'Crecimiento' | 'Maduración';
export type PlantZone = 'Zona A' | 'Zona B'; 

export interface PlantData {
    id: number;
    name: string;
    scientificName: string;
    count: number;
    stage: PlantStage;
    zone: PlantZone;
    isCritical: boolean;
    imageUrl: string;
    color: string;
    vol: number;
    freq: number; 
    raw: number; 
}