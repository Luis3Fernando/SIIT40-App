import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@config/environments';
import { TelemetriaDTO } from '@adapters/esp32DTOs';
import { LocalBackupLog } from '@models/FileMetadata';


const BACKUP_KEY = `${ENV.STORAGE_PREFIX}history_backup`;

export const HistoryBackupStorage = {
    getBackupLogs: async (): Promise<LocalBackupLog[]> => {
        try {
            const rawData = await AsyncStorage.getItem(BACKUP_KEY);
            return rawData ? JSON.parse(rawData) : [];
        } catch (error) {
            console.error("[HistoryBackupStorage] Error al leer el backup local", error);
            return [];
        }
    },

    saveOrUpdateBackup: async (fileName: string, data: TelemetriaDTO[]): Promise<void> => {
        try {
            const currentBackups = await HistoryBackupStorage.getBackupLogs();
            const isComplete = data.length >= 96;

            const otherBackups = currentBackups.filter(l => l.fileName !== fileName);
            
            const newEntry: LocalBackupLog = {
                fileName,
                data,
                isComplete,
                isSyncedToCloud: false, 
                lastDownloaded: new Date().toISOString()
            };

            await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify([...otherBackups, newEntry]));
            console.log(`[Backup] ${fileName} guardado localmente. Registros: ${data.length}`);
        } catch (error) {
            console.error("[HistoryBackupStorage] Error al guardar backup", error);
        }
    },

    setAsSynced: async (fileName: string): Promise<void> => {
        try {
            const logs = await HistoryBackupStorage.getBackupLogs();
            const updated = logs.map(l => 
                l.fileName === fileName ? { ...l, isSyncedToCloud: true } : l
            );
            await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error("[HistoryBackupStorage] Error al marcar sincronización", error);
        }
    },

    removeLog: async (fileName: string): Promise<void> => {
        const logs = await HistoryBackupStorage.getBackupLogs();
        const filtered = logs.filter(l => l.fileName !== fileName);
        await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(filtered));
    }
};