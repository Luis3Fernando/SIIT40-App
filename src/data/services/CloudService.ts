import { ENV } from '@config/environments';
import { LocalBackupLog } from '@models/FileMetadata';

export const CloudService = {
    uploadLog: async (log: LocalBackupLog): Promise<boolean> => {
        try {
            const response = await fetch(`${ENV.API_URL}/history/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: log.fileName,
                    data: log.data
                }),
            });

            return response.ok;
        } catch (error) {
            console.log("[CloudService] Error de red: El servidor no responde.");
            return false;
        }
    }
};