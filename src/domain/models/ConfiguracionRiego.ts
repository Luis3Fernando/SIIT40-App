export interface ConfiguracionRiego {
  zona: "A" | "B";
  estaActiva: boolean;
  volumenObjetivo: number;
  frecuenciaHoras: number;
  umbralHumedad: number;
  ultimoRiego: Date | null;
  proximoRiegoSegundos: number;
}