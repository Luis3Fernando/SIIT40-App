import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// Importamos la librería de gráficos
import { LineChart } from 'react-native-chart-kit'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40; // Ancho total menos padding de la pantalla (20 a cada lado)

// --- TIPADO ---
interface ChartDataPoint {
    label: string; // Etiqueta X (e.g., "29, Jun", "Lunes")
    value: number; // Valor Y (e.g., 45, 12.5)
}

interface StatsProps {
    title: string; // e.g., "Humedad del Suelo Zona A"
    unit: string;  // e.g., "%", "L", "RAW"
    dataPoints: ChartDataPoint[]; // Datos para la gráfica
}

// --- MOCK DATA (Para simular la data del ESP32) ---
const mockDataSets = {
    // Ejemplo: Datos para "Esta Semana"
    "Semana": [
        { label: 'Lun', value: 45 }, { label: 'Mar', value: 55 }, 
        { label: 'Mié', value: 65 }, { label: 'Jue', value: 50 },
        { label: 'Vie', value: 35 }, { label: 'Sáb', value: 40 }, 
        { label: 'Dom', value: 60 },
    ],
    // Ejemplo: Datos para "Horas del Día"
    "Hoy": [
        { label: '8 AM', value: 50 }, { label: '10 AM', value: 60 }, 
        { label: '12 PM', value: 75 }, { label: '2 PM', value: 68 }, 
        { label: '4 PM', value: 55 },
    ],
    // Ejemplo: Datos para "Meses"
    "Mes": [
        { label: 'Ene', value: 70 }, { label: 'Feb', value: 65 }, 
        { label: 'Mar', value: 50 }, { label: 'Abr', value: 40 },
    ],
};

const timeFilters = ["Semana", "Hoy", "Mes"];

const Stats = ({ title = "Nivel de Sensor", unit = "%", dataPoints = mockDataSets.Semana }: StatsProps) => {
    
    // Usamos los nombres de color de tu paleta
    const { PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE } = AppColors;

    // Estado local para el filtro de tiempo
    const [activeFilter, setActiveFilter] = useState<keyof typeof mockDataSets>("Semana");

    // Datos que se usan para el gráfico
    const currentData = mockDataSets[activeFilter] || dataPoints;
    const values = currentData.map(p => p.value);
    const labels = currentData.map(p => p.label);

    // Encuentra el valor máximo para resaltar (similar a la imagen)
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);

    // Estructura de datos requerida por react-native-chart-kit
    const chartData = {
        labels: labels,
        datasets: [
            {
                data: values,
                color: (opacity = 1) => PRIMARY_COLOR,
                strokeWidth: 2,
            }
        ]
    };

    // Configuración de la apariencia del gráfico
    const chartConfig = {
        backgroundColor: WHITE,
        backgroundGradientFrom: WHITE,
        backgroundGradientTo: WHITE,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(18, 153, 120, ${opacity})`, // Usa PRIMARY_COLOR con opacidad
        labelColor: (opacity = 1) => TEXT_GRAY,
        // Estilo del gráfico de área (para replicar la imagen)
        fillShadowGradientFrom: PRIMARY_COLOR,
        fillShadowGradientTo: WHITE,
        fillShadowGradientFromOpacity: 0.5,
        fillShadowGradientToOpacity: 0.1,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: PRIMARY_COLOR
        },
    };
    
    // Función de renderizado para el filtro de tiempo (Last Week, etc.)
    const renderTimeFilter = () => (
        <View style={styles.filterContainer}>
            {timeFilters.map((filter) => {
                const isActive = activeFilter === filter;
                const backgroundColor = isActive ? DARK_COLOR : WHITE;
                const textColor = isActive ? WHITE : DARK_COLOR;

                return (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterPill, { backgroundColor }]}
                        onPress={() => setActiveFilter(filter as keyof typeof mockDataSets)}
                    >
                        <Text style={[styles.filterText, { color: textColor }]}>
                            {filter === "Semana" ? "Esta Semana" : filter === "Hoy" ? "Hoy" : "Últimos Meses"}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            
            {/* Cabecera del Gráfico: Título y Filtro */}
            <View style={styles.header}>
                <Text style={styles.chartTitle}>{title}</Text>
                {renderTimeFilter()}
            </View>

            {/* Renderizado del Gráfico */}
            <View style={styles.chartWrapper}>
                <LineChart
                    data={chartData}
                    width={CHART_WIDTH - 40} // Ajustamos el ancho para que quepa dentro del padding
                    height={200}
                    chartConfig={chartConfig}
                    bezier // Curvas suaves como en la imagen
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    // Customizar el Tooltip (el punto flotante)
                    renderDotContent={({ x, y, index, indexData }) => {
                        // Resalta solo el punto de valor máximo
                        if (index === maxIndex) {
                            return (
                                <View
                                    key={index}
                                    style={[styles.highlightDot, { top: y - 20, left: x - 20, borderColor: PRIMARY_COLOR }]}
                                >
                                    <Text style={styles.highlightText}>
                                        {indexData}{unit}
                                    </Text>
                                    <Ionicons name="water" size={12} color={PRIMARY_COLOR} style={styles.highlightIcon} />
                                </View>
                            );
                        }
                        return null;
                    }}
                />
            </View>

        </View>
    );
};

export default Stats;

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.WHITE,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    
    // --- Cabecera y Filtro ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: AppColors.LIGHT_COLOR,
        borderRadius: 15,
        padding: 2,
    },
    filterPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // --- Gráfico ---
    chartWrapper: {
        alignItems: 'center',
    },

    // --- Punto Resaltado (Tooltip) ---
    highlightDot: {
        position: 'absolute',
        backgroundColor: AppColors.WHITE,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    highlightText: {
        fontSize: 12,
        fontWeight: '700',
        color: AppColors.PRIMARY_COLOR,
        marginRight: 4,
    },
    highlightIcon: {
        marginTop: 2, 
    }
});