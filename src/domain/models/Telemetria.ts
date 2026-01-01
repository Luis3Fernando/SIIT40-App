export interface Telemetria {
  TS: string;                 
  Nodo_ID: "A" | "B";
  Descripcion: string;      
  Estado_Actuadores: {
    Valvula: 0 | 1;           
    Manual: 0 | 1;            
  };
  Metricas_Agua: {
    Lmin: number;               
    Total_L: number;      
  };
  Metricas_Ambientales: {
    Suelo_RAW: number;    
    Temp_C: number;   
    Hum_Pct: number; 
    pH: number;                
    CO2: number;        
    Lux: number;           
  };
  Sistema: {
    Memoria_SD_Pct: number;
  };
}