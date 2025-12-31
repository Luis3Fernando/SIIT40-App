import { esp32Service } from '../../data/services/esp32Service';
import { historyStorage } from '../../data/storage/historyStorage';
import { mapTelemetriaToDomain } from '../../data/adapters/mapper';
import { TelemetriaDTO } from '../../data/adapters/esp32DTOs';

const isLogComplete = (logs: TelemetriaDTO[]): boolean => {
  if (logs.length === 0) return false;
  
  const lastEntry = logs[logs.length - 1];
  const lastTime = new Date(lastEntry.TS);
  const hours = lastTime.getHours();
  const minutes = lastTime.getMinutes();
  return (hours === 23 && minutes >= 20) || (hours === 0 && minutes <= 10);
};

export const getHistoryLog = async (fileName: string) => {
  const localData = await historyStorage.getDayLog(fileName);
  const todayStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit' 
  }).replace(/\//g, ''); 

  const isToday = fileName.includes(todayStr);

  if (localData && !isToday && isLogComplete(localData)) {
    console.log(`[Storage] Log ${fileName} completo. Cargando desde caché.`);
    return localData.map(mapTelemetriaToDomain);
  }

  console.log(`[ESP32] Solicitando ${fileName} por estar incompleto o ser actual.`);
  const remoteData = await esp32Service.fetchFileData(fileName);

  if (!('type' in remoteData)) {
    await historyStorage.saveDayLog(fileName, remoteData);
    return remoteData.map(mapTelemetriaToDomain);
  }

  if (localData) return localData.map(mapTelemetriaToDomain);

  return remoteData;
};