import { useState, useCallback } from 'react';
import { esp32Service } from '@services/esp32Service';
import { HistoryBackupStorage } from '@storage/HistoryBackupStorage';
import { useConnectionGuard } from './useConnectionGuard';
import { TelemetriaDTO } from '@adapters/esp32DTOs';

export const useHistorySync = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0); 
    const { isConnected } = useConnectionGuard();


    const syncWithHardware = useCallback(async () => {
        if (!isConnected) return { success: false, message: "No hay conexión al SIIT40" };

        setIsDownloading(true);
        setSyncProgress(0);

        try {
            const response = await esp32Service.fetchHistoryFiles();
            if ('type' in response) throw new Error("Error al listar archivos");

            const remoteFiles = response.files;
            const localLogs = await HistoryBackupStorage.getBackupLogs();

            const filesToDownload = remoteFiles.filter(remoteName => {
                const local = localLogs.find(l => l.fileName === remoteName);
                return !local || !local.isComplete;
            });

            if (filesToDownload.length === 0) {
                setIsDownloading(false);
                return { success: true, message: "Todo está actualizado" };
            }

            for (let i = 0; i < filesToDownload.length; i++) {
                const fileName = filesToDownload[i];
                const fileData = await esp32Service.fetchFileData(fileName);

                if (!('type' in fileData)) {
                    await HistoryBackupStorage.saveOrUpdateBackup(fileName, fileData as TelemetriaDTO[]);
                }
                setSyncProgress(Math.round(((i + 1) / filesToDownload.length) * 100));
            }

            return { success: true, message: `Sincronizados ${filesToDownload.length} archivos.` };
        } catch (error) {
            console.error("[SyncHook] Error:", error);
            return { success: false, message: "Fallo en la sincronización" };
        } finally {
            setIsDownloading(false);
        }
    }, [isConnected]);

    return {
        syncWithHardware,
        isDownloading,
        syncProgress
    };
};