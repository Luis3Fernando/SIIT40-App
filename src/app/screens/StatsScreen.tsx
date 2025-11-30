import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import Stats from '@components/Stats';

const mockParams = {
    metricName: "Humedad del Suelo Zona A", // Variable 'X'
    metricUnit: "%",
    metricKey: 'humedadA'
};

const StatsScreen = () => {
    const { DARK_COLOR, WHITE, PRIMARY_COLOR, LIGHT_COLOR } = AppColors;
    const { metricName, metricUnit } = mockParams;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
                
                {/* Título dinámico que recibe el nombre de la métrica */}
                <Text style={styles.mainTitle}>
                    Estadísticas sobre {metricName}
                </Text>
                
                {/* 1. Uso del Componente Stats para la visualización de la tendencia */}
                {/* El componente Stats contiene el filtro de tiempo ("Semana", "Hoy", etc.) */}
                <Stats 
                    title={metricName}
                    unit={metricUnit}
                    // dataPoints queda vacío para usar el mockDataSet interno de Stats.tsx
                    dataPoints={[]} 
                />

                {/* 2. Sección para datos clave o resumen */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumen de la Semana</Text>
                    <Text style={styles.summaryText}>Valor Máximo Registrado: 75{metricUnit}</Text>
                    <Text style={styles.summaryText}>Valor Promedio: 50{metricUnit}</Text>
                    <Text style={styles.summaryText}>Total de Registros Recolectados: 154</Text>
                </View>

                {/* 3. Placeholder para la tabla de registros detallados */}
                <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>
                        [Aquí se incluirá la tabla detallada de registros históricos]
                    </Text>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

export default StatsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.WHITE,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: AppColors.DARK_COLOR, 
        marginTop: 5,
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: AppColors.LIGHT_COLOR,
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        // Sombra para contraste
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        color: AppColors.DARK_COLOR,
        marginBottom: 4,
    },
    placeholderCard: {
        height: 100,
        backgroundColor: AppColors.LIGHT_COLOR,
        opacity: 0.6,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: AppColors.PRIMARY_COLOR,
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: AppColors.DARK_COLOR,
        fontWeight: 'bold',
    },
});