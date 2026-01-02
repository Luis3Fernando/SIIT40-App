import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { HistoryBackupStorage } from '@storage/HistoryBackupStorage';
import { CloudService } from '@services/CloudService';
import { LocalBackupLog } from '@models/FileMetadata';

export const useCloudSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);

    const uploadPendingLogs = useCallback(async (logs: LocalBackupLog[]) => {
        const toSync = logs.filter(l => !l.isSyncedToCloud);

        if (toSync.length === 0) {
            Alert.alert("Información", "No hay archivos pendientes para subir.");
            return;
        }

        setIsSyncing(true);
        let successCount = 0;

        try {
            for (const log of toSync) {
                const success = await CloudService.uploadLog(log);
                
                if (success) {
                    await HistoryBackupStorage.setAsSynced(log.fileName);
                    successCount++;
                }
            }

            if (successCount === toSync.length) {
                Alert.alert("Éxito", "Todos los archivos se sincronizaron con la nube.");
            } else if (successCount > 0) {
                Alert.alert("Sincronización Parcial", `Se subieron ${successCount} de ${toSync.length} archivos.`);
            } else {
                Alert.alert("Error de Conexión", "El servidor de la nube no respondió. Intenta más tarde.");
            }
        } catch (error) {
            Alert.alert("Error Crítico", "Ocurrió un error inesperado al subir los datos.");
        } finally {
            setIsSyncing(false);
        }
    }, []);

    return {
        uploadPendingLogs,
        isSyncing
    };
};