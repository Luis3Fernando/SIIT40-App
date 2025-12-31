export interface TelemetriaDTO {
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

export interface ListFilesResponseDTO {
  files: string[];
}

export interface ZonaConfigDTO {
  activa: boolean;
  vol: number;
  freq: number;
  umbral: number;
  ultimo: string;
  sig_en_seg: number;
}

export interface GetConfigResponseDTO {
  A: ZonaConfigDTO;
  B: ZonaConfigDTO;
}

export interface StatusResponseDTO {
  sd_total_mb: number;
  sd_usado_mb: number;
  sd_libre_pct: number;
  wifi_rssi: number;
  uptime_seg: number;
}