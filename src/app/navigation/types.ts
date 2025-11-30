import { NavigatorScreenParams } from '@react-navigation/native';

// Definición de los parámetros para el Tab Navigator
export type RootTabParamList = {
  // Las rutas principales del Bottom Tab
  Dashboard: undefined; // Módulo 2: Visualización y Monitoreo
  Control: undefined;   // Módulo 3: Control y Estado (unifica A y B)
  Data: undefined;      // Módulo 4: Gestión de Datos (Historial y Sincronización)
  Connectivity: undefined; // Módulo 1: Conectividad y Acceso

  // Podrías tener un Stack Navigator dentro de un Tab para las pantallas detalladas
  // Por ejemplo, ControlStack: NavigatorScreenParams<ControlStackParamList>;
};

// Si usas un stack para la navegación dentro del tab de Control, por ejemplo:
export type ControlStackParamList = {
    ControlSummary: undefined;
    ZoneADetails: undefined;
    ZoneBDetails: undefined;
};

// Exporta el tipo para usarlo en los Hooks de navegación
// Aquí definimos el tipo para la navegación que se usará en toda la App
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}