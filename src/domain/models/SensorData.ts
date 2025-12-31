export interface SensorData {
  timestamp: Date;
  zonaId: "A" | "B";
  mensajeEstado: string;
  valvulaAbierta: boolean;
  esRiegoManual: boolean;
  caudalLmin: number;
  totalLitrosDia: number;
  humedadSuelo: number;
  temperatura: number;
  humedadAmbiente: number;
  ph: number;
  co2: number;
  lux: number;
  bateriaOSistema: number;
}