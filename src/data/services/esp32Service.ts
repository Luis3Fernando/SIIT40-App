import axios, { AxiosInstance } from "axios";
import { ESP32_CONFIG } from "@config/esp32";
import { handleAxiosError, AppFailure } from "@errors/Failures";
import {
  TelemetriaDTO,
  GetConfigResponseDTO,
  ListFilesResponseDTO,
} from "@adapters/esp32DTOs";

const apiClient: AxiosInstance = axios.create({
  baseURL: ESP32_CONFIG.BASE_URL,
  timeout: ESP32_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const esp32Service = {
  fetchCurrentStatus: async (): Promise<TelemetriaDTO[] | AppFailure> => {
    try {
      console.log(
        "Intentando conectar a:",
        ESP32_CONFIG.BASE_URL + ESP32_CONFIG.ENDPOINTS.NOW
      );
      const { data } = await apiClient.get<TelemetriaDTO[]>(
        ESP32_CONFIG.ENDPOINTS.NOW
      );
      console.log("¡Data recibida con éxito!");
      return data;
    } catch (error: any) {
      console.error("ERROR AXIOS:", error.message);
      return handleAxiosError(error);
    }
  },

  fetchIrrigationConfig: async (): Promise<
    GetConfigResponseDTO | AppFailure
  > => {
    try {
      const { data } = await apiClient.get<GetConfigResponseDTO>(
        ESP32_CONFIG.ENDPOINTS.GET_CONFIG
      );
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  updateZoneConfig: async (
    zoneId: "A" | "B",
    vol: number,
    freq: number,
    raw: number
  ): Promise<string | AppFailure> => {
    try {
      const { data } = await apiClient.get(ESP32_CONFIG.ENDPOINTS.SET_CONFIG, {
        params: { id: zoneId, vol, freq, raw },
      });
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  triggerManualIrrigation: async (
    zoneId: "A" | "B",
    liters: number
  ): Promise<string | AppFailure> => {
    try {
      const { data } = await apiClient.get(
        ESP32_CONFIG.ENDPOINTS.MANUAL_IRRIGATION,
        {
          params: { id: zoneId, litros: liters },
        }
      );
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  fetchHistoryFiles: async (): Promise<ListFilesResponseDTO | AppFailure> => {
    try {
      const { data } = await apiClient.get<ListFilesResponseDTO>(
        ESP32_CONFIG.ENDPOINTS.LIST_FILES
      );
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  fetchFileData: async (
    fileName: string
  ): Promise<TelemetriaDTO[] | AppFailure> => {
    try {
      const { data } = await apiClient.get<TelemetriaDTO[]>(
        ESP32_CONFIG.ENDPOINTS.GET_FILE,
        {
          params: { file: fileName },
        }
      );
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
