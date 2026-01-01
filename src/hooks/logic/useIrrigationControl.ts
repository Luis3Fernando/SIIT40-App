import { useState } from 'react';
import { Alert } from 'react-native';
import { esp32Service } from '@services/esp32Service';
import { PlantZone } from '@models/PlantData';

export const useIrrigationControl = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleIrrigation = async (zone: PlantZone, liters: number) => {
        setIsProcessing(true);
        const zoneId = zone === 'Zona A' ? 'A' : 'B';

        try {
            const result = await esp32Service.triggerManualIrrigation(zoneId, liters);

            if (typeof result === 'string') {
                const message = liters > 0 
                    ? `Riego iniciado en ${zone} (${liters}L).` 
                    : `Riego detenido en ${zone}.`;
                
                console.log(`[Control] ${message}`);
            } else {
                throw new Error("No se recibió confirmación del hardware");
            }
        } catch (error) {
            console.error("[Control Error]", error);
            Alert.alert("Error de Control", "No se pudo comunicar con el invernadero para cambiar el estado del riego.");
        } finally {
            setIsProcessing(false);
        }
    };

    const startIrrigation = (zone: PlantZone, amount: number) => toggleIrrigation(zone, amount);
    const stopIrrigation = (zone: PlantZone) => toggleIrrigation(zone, 0);

    return {
        startIrrigation,
        stopIrrigation,
        isProcessing
    };
};