import { TelemetriaDTO, ZonaConfigDTO } from './esp32DTOs';
import { SensorData } from '@models/SensorData';
import { ConfiguracionRiego } from '@models/ConfiguracionRiego';

export const mapTelemetriaToDomain = (dto: TelemetriaDTO): SensorData => ({
  timestamp: new Date(dto.TS),
  zonaId: dto.Nodo_ID,
  mensajeEstado: dto.Descripcion,
  valvulaAbierta: dto.Estado_Actuadores.Valvula === 1,
  esRiegoManual: dto.Estado_Actuadores.Manual === 1,
  caudalLmin: dto.Metricas_Agua.Lmin,
  totalLitrosDia: dto.Metricas_Agua.Total_L,
  humedadSuelo: dto.Metricas_Ambientales.Suelo_RAW,
  temperatura: dto.Metricas_Ambientales.Temp_C,
  humedadAmbiente: dto.Metricas_Ambientales.Hum_Pct,
  ph: dto.Metricas_Ambientales.pH,
  co2: dto.Metricas_Ambientales.CO2,
  lux: dto.Metricas_Ambientales.Lux,
  bateriaOSistema: dto.Sistema.Memoria_SD_Pct,
});

export const mapConfigToDomain = (id: "A" | "B", dto: ZonaConfigDTO): ConfiguracionRiego => ({
  zona: id,
  estaActiva: dto.activa,
  volumenObjetivo: dto.vol,
  frecuenciaHoras: dto.freq,
  umbralHumedad: dto.umbral,
  ultimoRiego: dto.ultimo !== "N/A" ? new Date(dto.ultimo) : null,
  proximoRiegoSegundos: dto.sig_en_seg,
});