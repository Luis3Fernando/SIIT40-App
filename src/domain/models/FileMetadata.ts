import { TelemetriaDTO } from "@adapters/esp32DTOs";

export interface LocalBackupLog {
    fileName: string;   
    isComplete: boolean;  
    isSyncedToCloud: boolean; 
    lastDownloaded: string;
    data: TelemetriaDTO[]; 
}