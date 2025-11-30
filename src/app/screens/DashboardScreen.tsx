import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';
import ListSpecies from '@components/ListSpecies';
// Importamos el hook de navegación
import { useNavigation } from '@react-navigation/native';
// Tipos de navegación específicos
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, RootTabParamList } from '@navigation/types';

// Definimos el tipo de navegación COMPUESTO para tipado seguro:
// Es una Pila (Stack) DENTRO de un Tab.
type DashboardScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList, 'HomeDashboard'>,
    BottomTabNavigationProp<RootTabParamList>
>;


const { width } = Dimensions.get('window');
// Ajustamos CARD_WIDTH para la cuadrícula de 2 columnas con padding de 20 a cada lado
const GRID_ITEM_WIDTH = (width - 60) / 2; 

// --- DATOS DEL INVERNADERO ---
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

// --- DATOS AMBIENTALES DEFINITIVOS (5 SENSORES) ---
interface EnvironmentalData {
    temperature: number | null; 
    airHumidity: number | null; 
    co2: number | null;         
    soilMoisture: number | null; 
    light: number | null; // Nuevo sensor de Luz (Lux)
}

// MOCK DATA DE CONDICIONES (simulando que el CO2 no está disponible)
const mockEnvironmentalData: EnvironmentalData = {
    temperature: 28.4,
    airHumidity: 55,
    co2: null, 
    soilMoisture: 3500,
    light: 12000,
};

// Lista estática de sensores para mapear la cuadrícula
const environmentalSensors = [
    { key: 'temperature', label: 'Temperatura', unit: '°C', icon: 'thermometer-outline' },
    { key: 'airHumidity', label: 'Humedad Aire', unit: '%', icon: 'water-outline' },
    { key: 'co2', label: 'Nivel CO2', unit: ' ppm', icon: 'pulse-outline' },
    { key: 'soilMoisture', label: 'Humedad Suelo', unit: ' RAW', icon: 'leaf-outline' },
    { key: 'light', label: 'Intensidad Luz', unit: ' Lux', icon: 'sunny-outline' },
];

const DashboardScreen = () => {
    // Inicializamos la navegación con el nuevo tipo compuesto
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    
    // Desestructuramos solo los colores que se usan
    const { 
        PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE, 
        LIGHT_COLOR, SECUNDARY_COLOR 
    } = AppColors;
    
    // Función de renderizado: Fila de Métricas Superiores
    // ACEPTA LA PROPIEDAD KEY
    const renderMetricPill = (key: string, iconName: keyof typeof Ionicons.glyphMap, title: string, value: string, color: string) => (
        <View key={key} style={styles.metricPill}>
            <Ionicons name={iconName} size={20} color={color} style={{ marginBottom: 5 }} />
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
        </View>
    );

    // --- FUNCIÓN REFATORIZADA: PASTILLA DE CONDICIÓN (Interactiva y en Cuadrícula) ---
    const renderConditionPill = (
        iconName: keyof typeof Ionicons.glyphMap, 
        label: string, 
        value: string | number | null, 
        unit: string,
        metricKey: keyof EnvironmentalData
    ) => {
        const isAvailable = value !== null;
        const displayValue = isAvailable ? `${value}${unit}` : 'N/D';
        const displayLabel = isAvailable ? label : 'No disponible';
        
        // Colores
        const iconColor = isAvailable ? PRIMARY_COLOR : SECUNDARY_COLOR;
        const valueColor = isAvailable ? DARK_COLOR : SECUNDARY_COLOR;
        const labelColor = isAvailable ? TEXT_GRAY : SECUNDARY_COLOR;

        // Función de navegación
        const handlePress = () => {
            if (isAvailable) {
                // CORRECCIÓN CLAVE: Usamos la navegación anidada correcta
                navigation.navigate('Home', { // Navega a la pestaña 'Home' (el Stack)
                    screen: 'Stats',            // Especifica la pantalla 'Stats' dentro de ese Stack
                    params: {                   // Pasa los parámetros
                        metricName: label,
                        metricUnit: unit.trim(),
                        metricKey: metricKey,
                    }
                });
            }
        };

        return (
            <TouchableOpacity 
                key={metricKey} // <--- AÑADIDO KEY AQUÍ
                style={styles.conditionItem} 
                onPress={handlePress}
                disabled={!isAvailable} // Deshabilita el toque si no hay datos
            >
                <View style={styles.conditionIconArea}>
                    <Ionicons name={iconName} size={30} color={iconColor} />
                </View>
                
                <Text style={[styles.conditionLabel, { color: labelColor }]}>{displayLabel}</Text>
                <Text style={[styles.conditionValue, { color: valueColor }]}>{displayValue}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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

                {/* === ACCIÓN 1: FILA DE MÉTRICAS CLAVE (Resúmenes) === */}
                <View style={styles.metricRow}>
                    {/* PASANDO LA PROPIEDAD KEY ÚNICA */}
                    {renderMetricPill("key-promedio", "speedometer-outline", "Promedio", `${mockData.humedadPromedio}%`, DARK_COLOR)}
                    {renderMetricPill("key-totallitros", "water-outline", "Total Litros", `${mockData.consumoTotal.toFixed(1)} L`, DARK_COLOR)}
                    {renderMetricPill("key-litrosa", "cloud-upload-outline", "Litros A", `${mockData.litrosZonaA} L`, DARK_COLOR)}
                </View>
                
                {/* === ACCIÓN 2: CONDICIONES AMBIENTALES (Cuadrícula 2x2) === */}
                <Text style={styles.sectionTitle}>Sensores y Ambiente</Text>
                
                <View style={styles.conditionsGrid}>
                    {environmentalSensors.map((sensor) => (
                        // El KEY se añade automáticamente a la TouchableOpacity dentro de renderConditionPill
                        renderConditionPill(
                            sensor.icon as keyof typeof Ionicons.glyphMap, // Forzamos el tipo de icono
                            sensor.label,
                            mockEnvironmentalData[sensor.key as keyof EnvironmentalData], // Obtenemos el valor del mock
                            sensor.unit,
                            sensor.key as keyof EnvironmentalData // Clave para la API y usada como KEY
                        )
                    ))}
                </View>

                {/* === LISTA DE ESPECIES === */}
                <Text style={styles.sectionTitle}>Especies y Zonas</Text>
                <View style={styles.speciesListContainer}>
                    <ListSpecies />
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
    
    // --- Cabecera ---
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
    
    // --- Filas de Métricas (Reusables) ---
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingVertical: 10,
        borderRadius: 12,
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

    // --- Estilos Específicos para Condiciones Ambientales (Cuadrícula 2x2) ---
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    conditionItem: {
        width: GRID_ITEM_WIDTH, 
        height: GRID_ITEM_WIDTH,
        backgroundColor: AppColors.WHITE,
        borderRadius: 15,
        marginBottom: 20,
        padding: 15,
        alignItems: 'flex-start', // Alineado a la izquierda para el diseño modular
        justifyContent: 'space-between',
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: AppColors.LIGHT_COLOR, // Borde suave
    },
    conditionIconArea: {
        marginBottom: 10, // Espacio entre el icono y el texto
    },
    conditionLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 5,
        // Usamos flexShrink para evitar que el texto largo empuje la tarjeta
        flexShrink: 1, 
    },
    conditionValue: {
        fontSize: 18,
        fontWeight: '900', // Más énfasis en el valor
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
        flex: 1,
        minHeight: 400, 
    },
    
    // --- Estilos No Usados Eliminados (para limpieza) ---
    // Mantuvimos los placeholders si los quieres usar después
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
});