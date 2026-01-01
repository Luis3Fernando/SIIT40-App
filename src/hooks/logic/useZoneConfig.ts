import { useState } from 'react';
import { esp32Service } from '@services/esp32Service';
import { Species, PlantData, PlantZone } from '@models/PlantData';
import { usePlants } from '@custom-hooks/logic/usePlants';
import { Alert } from 'react-native';

export const useZoneConfig = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { plants, refetch: refetchPlants } = usePlants();

  const addPlantToZone = async (newSpecies: Species, zone: PlantZone) => {
    setIsUpdating(true);

    try {
      const zonePlants = plants.filter(p => p.zone === zone);
      const allRequirements = [...zonePlants, newSpecies];
      const totalPlants = allRequirements.length;
      
      const avgVol = allRequirements.reduce((acc, curr) => acc + curr.vol, 0) / totalPlants;
      const avgFreq = allRequirements.reduce((acc, curr) => acc + curr.freq, 0) / totalPlants;
      const avgRaw = allRequirements.reduce((acc, curr) => acc + curr.raw, 0) / totalPlants;

      const finalConfig = {
        vol: parseFloat(avgVol.toFixed(2)),
        freq: Math.round(avgFreq), 
        raw: Math.round(avgRaw)
      };

      console.log(`[Config] Enviando a ${zone}:`, finalConfig);

      const zoneId = zone === 'Zona A' ? 'A' : 'B';
      const result = await esp32Service.updateZoneConfig(
        zoneId,
        finalConfig.vol,
        finalConfig.freq,
        finalConfig.raw
      );

      if (typeof result === 'string') {
        Alert.alert("Éxito", `Zona ${zoneId} actualizada. Promedio aplicado.`);
        await refetchPlants();
      } else {
        throw new Error("Error en la respuesta del hardware");
      }

    } catch (error) {
      console.error("Error actualizando zona:", error);
      Alert.alert("Error", "No se pudo comunicar con el invernadero.");
    } finally {
      setIsUpdating(false);
    }
  };

  return { addPlantToZone, isUpdating };
};