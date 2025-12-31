import { esp32Service } from '@services/esp32Service';
import { mapTelemetriaToDomain } from '@adapters/mapper';
import { SensorData } from '@models/SensorData';
import { AppFailure } from '@errors/Failures';

export const getCurrentStatus = async (): Promise<SensorData[] | AppFailure> => {
  const result = await esp32Service.fetchCurrentStatus();

  if ('type' in result) {
    return result;
  }

  return result.map(dto => mapTelemetriaToDomain(dto));
};