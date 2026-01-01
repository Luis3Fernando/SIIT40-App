export interface DashboardData {
  temperature: number | null;
  airHumidity: number | null;
  co2: number | null;
  soilMoisture: number | null;
  light: number | null;
  species: number;
}

export interface ValveStatus {
  zone: "A" | "B";
  isOpen: boolean;
  isManual: boolean;
  flowRate: number;     
  totalLitros: number;   
  humedadSuelo: number;  
}