import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelemetriaDTO } from '@adapters/esp32DTOs';

const LOG_PREFIX = '@log_';

export const historyStorage = {
  saveDayLog: async (fileName: string, data: TelemetriaDTO[]) => {
    try {
      await AsyncStorage.setItem(`${LOG_PREFIX}${fileName}`, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving local log", e);
    }
  },

  getDayLog: async (fileName: string): Promise<TelemetriaDTO[] | null> => {
    try {
      const data = await AsyncStorage.getItem(`${LOG_PREFIX}${fileName}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
};