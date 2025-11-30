import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // (Ancho total - Padding de ambos lados) / 2

// --- MOCK DATA para maquetación ---
const mockData = {
  connectionStatus: 'CONECTADO', 
  lastTimestamp: '2024-07-26 10:30 AM', 
  humedadZonaA: 3250, // V1 RAW
  estadoA: 'Mojado', // V1 Estado
  litrosZonaA: 0.5,
  humedadZonaB: 1500,
  estadoB: 'Seco', 
  litrosZonaB: 12.0,
  consumoTotal: 12.5, // V2 (Consumo de Agua Total)
  humedadPromedio: 65, // Para el indicador superior
};

const DashboardScreen = () => {
  const { 
    PRIMARY_COLOR, SECUNDARY_COLOR, DARK_COLOR, 
    LIGHT_COLOR, TEXT_GRAY, WHITE, 
    STATUS_DANGER, BLACK 
  } = AppColors;

  // Función de ayuda para determinar el color del estado
  const getStatusColor = (status: string) => {
    return status === 'Seco' ? STATUS_DANGER : PRIMARY_COLOR;
  };
  
  // Función para renderizar la tarjeta modular de datos superiores
  const renderMetricPill = (iconName: keyof typeof Ionicons.glyphMap, title: string, value: string, color: string) => (
      <View style={styles.metricPill}>
          <Ionicons name={iconName} size={20} color={color} style={{ marginBottom: 5 }} />
          <Text style={styles.metricValue}>{value}</Text>
          <Text style={styles.metricTitle}>{title}</Text>
      </View>
  );

  // Función para renderizar una tarjeta de control (usando el estilo de la imagen)
  const renderControlCard = (title: string, subtitle: string, iconName: keyof typeof Ionicons.glyphMap, isDark: boolean, onPress: () => void) => {
      const bgColor = isDark ? DARK_COLOR : WHITE;
      const titleColor = isDark ? WHITE : DARK_COLOR;
      const subtitleColor = isDark ? TEXT_GRAY : TEXT_GRAY;
      const iconColor = isDark ? SECUNDARY_COLOR : PRIMARY_COLOR; // Icono Neo en tarjeta oscura

      return (
          <TouchableOpacity 
              style={[styles.controlCard, { backgroundColor: bgColor }]}
              onPress={onPress}
          >
              <View style={styles.controlIconContainer}>
                  <Ionicons name={iconName} size={28} color={iconColor} />
                  {/* Placeholder para Toggle (R1, R2) */}
                  <View style={[styles.togglePlaceholder, {backgroundColor: isDark ? PRIMARY_COLOR : LIGHT_COLOR}]} />
              </View>
              <Text style={[styles.controlTitle, { color: titleColor }]}>{title}</Text>
              <Text style={[styles.controlSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
          </TouchableOpacity>
      );
  };
  
  // Renderizar la tarjeta de Monitoreo de Humedad de la Zona A (adaptado al estilo modular)
  const renderZoneHumedadCard = () => {
      const statusColor = getStatusColor(mockData.estadoA);
      
      return (
          <View style={[styles.controlCard, { backgroundColor: statusColor }]}>
              <View style={styles.controlIconContainer}>
                  <Ionicons name="leaf-outline" size={28} color={WHITE} />
                  {/* Placeholder de Estado (R3) */}
                  <View style={[styles.statusTag, { backgroundColor: mockData.estadoA === 'Seco' ? SECUNDARY_COLOR : DARK_COLOR }]}>
                    <Text style={styles.statusTagText}>{mockData.estadoA}</Text>
                  </View>
              </View>
              <Text style={[styles.controlTitle, { color: WHITE }]}>Humedad Zona A</Text>
              <Text style={[styles.controlSubtitle, { color: LIGHT_COLOR }]}>{mockData.humedadZonaA} RAW</Text>
          </View>
      );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollViewContent}>
        
        {/* === 1. ENCABEZADO Y UBICACIÓN (Adaptado de la imagen) === */}
        <View style={styles.header}>
            {/* Tag de Conexión (C2) */}
            <View style={styles.tagPill}>
                <Ionicons 
                    name={mockData.connectionStatus === 'CONECTADO' ? "checkmark-circle" : "close-circle"} 
                    size={14} 
                    color={WHITE} 
                    style={{ marginRight: 5 }}
                />
                <Text style={styles.tagText}>{mockData.connectionStatus}</Text>
            </View>
            
            {/* V3: Última actualización */}
            <Text style={styles.lastUpdateText}>
                Última Act.: {mockData.lastTimestamp}
            </Text>
        </View>

        <Text style={styles.mainTitle}>SIIT40: Invernadero 1</Text>
        <View style={styles.subtitleRow}>
            <Ionicons name="location-outline" size={16} color={TEXT_GRAY} />
            <Text style={styles.mainSubtitle}>Abancay, Perú</Text>
        </View>
        <View style={styles.metricRow}>
            {renderMetricPill("speedometer-outline", "Promedio", `${mockData.humedadPromedio}%`, DARK_COLOR)}
            {renderMetricPill("water-outline", "Total Litros", `${mockData.consumoTotal.toFixed(1)} L`, DARK_COLOR)}
            {/* Usamos el estado de conexión como una métrica más */}
            {renderMetricPill("cloud-upload-outline", "Litros A", `${mockData.litrosZonaA} L`, DARK_COLOR)}
        </View>
      
        <Text style={styles.sectionTitle}>Control y Monitoreo (V1, R1, R2, R3)</Text>
        
        <View style={styles.controlGrid}>
            
            {/* Card 1: Humedad Zona A (V1) - Usando el estilo de la imagen */}
            {renderZoneHumedadCard()}

            {/* Card 2: Control Válvula B (R2) */}
            {renderControlCard(
                "Válvula Zona B",
                mockData.estadoB === 'Seco' ? "Estado: Seco" : "Cerrar ahora",
                "water-sharp",
                false, // Fondo blanco
                () => console.log('Toggle Válvula B')
            )}
            
            {/* Card 3: Monitoreo Humedad B (V1) */}
             {renderControlCard(
                "Humedad B (RAW)",
                `${mockData.humedadZonaB} RAW`,
                "leaf-outline",
                false, // Fondo blanco
                () => console.log('Ver Humedad B')
            )}

            {/* Card 4: Botón de Reset Litros (R4) - Oscuro para énfasis */}
            {renderControlCard(
                "Reset Contador",
                "Litros A y B: " + mockData.consumoTotal.toFixed(1) + " L",
                "reload-circle-outline",
                true, // Fondo oscuro
                () => console.log('Reset Contadores')
            )}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE, 
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  
  // --- Encabezado ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.PRIMARY_COLOR, // Verde primario como fondo
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.WHITE,
  },
  lastUpdateText: {
    fontSize: 12,
    color: AppColors.TEXT_GRAY,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.DARK_COLOR, 
    marginTop: 5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.TEXT_GRAY,
    marginLeft: 5,
  },

  // --- Fila de Métricas Superiores ---
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: AppColors.WHITE, // Fondo blanco para la fila
    paddingVertical: 10,
    borderRadius: 12,
  },
  metricPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: AppColors.LIGHT_COLOR, // Línea sutil de separación
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.DARK_COLOR,
  },
  metricTitle: {
    fontSize: 12,
    color: AppColors.TEXT_GRAY,
    marginTop: 2,
  },

  // --- Sección de Control Modular ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.DARK_COLOR,
    marginTop: 10,
    marginBottom: 15,
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    // Sombra para tarjetas claras
    shadowColor: AppColors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, 
    justifyContent: 'space-between',
  },
  controlIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  togglePlaceholder: {
    width: 38,
    height: 20,
    borderRadius: 10,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusTagText: {
    color: AppColors.WHITE,
    fontWeight: '600',
    fontSize: 12,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 'auto', // Empuja el título hacia abajo si hay espacio
  },
  controlSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
  },
  
  // Para la métrica de Humedad A, la tarjeta es de color de estado
  zoneCard: {
      width: CARD_WIDTH,
      height: CARD_WIDTH,
      padding: 15,
      borderRadius: 15,
      marginBottom: 20,
      justifyContent: 'space-between',
      shadowColor: AppColors.BLACK,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
  },
  zoneTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: AppColors.WHITE,
  },
  zoneRawValue: {
      fontSize: 28,
      fontWeight: '900',
      color: AppColors.SECUNDARY_COLOR, // Resalta el valor RAW con el color NEO
      marginTop: 5,
  },
  zoneStatus: {
      fontSize: 14,
      fontWeight: '500',
      color: AppColors.WHITE,
  }
});

export default DashboardScreen;