import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';
import ListSpecies from '@components/ListSpecies'; // Importamos el nuevo componente

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // Constante de la cuadrícula, se puede mantener si se usa más abajo

// --- MOCK DATA para el Encabezado y Métricas ---
const mockData = {
    connectionStatus: 'CONECTADO', 
    lastTimestamp: '2024-07-26 10:30 AM', 
    humedadZonaA: 3250,
    estadoA: 'Mojado',
    litrosZonaA: 0.5,
    humedadZonaB: 1500,
    estadoB: 'Seco', 
    litrosZonaB: 12.0,
    consumoTotal: 12.5, 
    humedadPromedio: 65,
};

const DashboardScreen = () => {
    // Desestructuramos solo los colores que se usan en el renderizado actual
    const { 
        PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE, 
        LIGHT_COLOR, 
    } = AppColors;
    
    // Función de renderizado usada: Fila de Métricas
    const renderMetricPill = (iconName: keyof typeof Ionicons.glyphMap, title: string, value: string, color: string) => (
        <View style={styles.metricPill}>
            <Ionicons name={iconName} size={20} color={color} style={{ marginBottom: 5 }} />
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* ScrollView principal para toda la pantalla */}
            <ScrollView style={styles.scrollViewContent}>
                
                {/* === ENCABEZADO Y ESTADO === */}
                <View style={styles.header}>
                    <View style={styles.tagPill}>
                        <Ionicons 
                            name={mockData.connectionStatus === 'CONECTADO' ? "checkmark-circle" : "close-circle"} 
                            size={14} 
                            color={WHITE} 
                            style={{ marginRight: 5 }}
                        />
                        <Text style={styles.tagText}>{mockData.connectionStatus}</Text>
                    </View>
                    <Text style={styles.lastUpdateText}>
                        Última Act.: {mockData.lastTimestamp}
                    </Text>
                </View>
                
                <Text style={styles.mainTitle}>SIIT40: Invernadero 1</Text>
                
                <View style={styles.subtitleRow}>
                    <Ionicons name="location-outline" size={16} color={TEXT_GRAY} />
                    <Text style={styles.mainSubtitle}>Abancay, Perú</Text>
                </View>

                {/* === FILA DE MÉTRICAS CLAVE (V1 Promedio, V2 Total Litros) === */}
                <View style={styles.metricRow}>
                    {renderMetricPill("speedometer-outline", "Promedio", `${mockData.humedadPromedio}%`, DARK_COLOR)}
                    {renderMetricPill("water-outline", "Total Litros", `${mockData.consumoTotal.toFixed(1)} L`, DARK_COLOR)}
                    {renderMetricPill("cloud-upload-outline", "Litros A", `${mockData.litrosZonaA} L`, DARK_COLOR)}
                </View>
                
                {/* === INTEGRACIÓN DEL COMPONENTE LISTSPECIES === */}
                <Text style={styles.sectionTitle}>Especies y Zonas</Text>
                <View style={styles.speciesListContainer}>
                    <ListSpecies />
                </View>
                
                {/* Puedes añadir un placeholder aquí para la cuadrícula de control si lo deseas */}
                <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>
                        [Aquí va la cuadrícula de Humedad A/B, Litros Totales, etc.]
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.WHITE, 
    },
    scrollViewContent: {
        paddingTop: 10,
    },
    
    // --- Estilos Usados ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    tagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.PRIMARY_COLOR,
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
        paddingHorizontal: 20,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    mainSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: AppColors.TEXT_GRAY,
        marginLeft: 5,
    },
    
    // --- Fila de Métricas ---
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingVertical: 10,
        borderRadius: 12,
        // Usar paddingHorizontal 0 aquí para que la separación de la columna funcione bien
    },
    metricPill: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: AppColors.LIGHT_COLOR,
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
    
    // --- ListSpecies Container ---
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    speciesListContainer: {
        // El componente ListSpecies tiene su propio padding/scroll, 
        // así que lo integramos directamente.
        flex: 1,
        minHeight: 400, // Asegura que se vea en el ScrollView del Dashboard
    },
    
    // --- Placeholder (Estilos Limpiados) ---
    placeholderCard: {
        height: 100,
        backgroundColor: AppColors.LIGHT_COLOR,
        opacity: 0.6,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: AppColors.PRIMARY_COLOR,
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: AppColors.DARK_COLOR,
        fontWeight: 'bold',
    },

    // --- Estilos No Usados Eliminados ---
    // controlGrid, controlCard, togglePlaceholder, statusTag, zoneCard, etc. 
    // FUE ELIMINADO ya que solo se usaba para las funciones de renderizado que quitaste.
});