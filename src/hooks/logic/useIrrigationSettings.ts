import { useState, useCallback } from 'react';
import { esp32Service } from '@services/esp32Service';
import { GetConfigResponseDTO } from '@adapters/esp32DTOs';
import { useConnectionGuard } from './useConnectionGuard';

export const useIrrigationSettings = () => {
    const [config, setConfig] = useState<GetConfigResponseDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isConnected } = useConnectionGuard();

    const fetchSettings = useCallback(async () => {
        if (!isConnected) return;
        
        setLoading(true);
        setError(null);
        try {
            const result = await esp32Service.fetchIrrigationConfig();
            
            if (result && !('type' in result)) {
                setConfig(result as GetConfigResponseDTO);
            } else {
                setError("No se pudo obtener la configuración del hardware.");
            }
        } catch (e) {
            setError("Error de red al consultar configuración.");
        } finally {
            setLoading(false);
        }
    }, [isConnected]);

    return { config, loading, error, refetch: fetchSettings };
};