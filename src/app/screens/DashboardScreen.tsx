import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';
import ListSpecies from '@components/ListSpecies';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, RootTabParamList } from '@navigation/types';

type DashboardScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList, 'HomeDashboard'>,
    BottomTabNavigationProp<RootTabParamList>
>;

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 60) / 3; 

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
interface EnvironmentalData {
    temperature: number | null; 
    airHumidity: number | null; 
    co2: number | null;         
    soilMoisture: number | null; 
    light: number | null; 
    species: number | null; 
}

const mockEnvironmentalData: EnvironmentalData = {
    temperature: 28.4,
    airHumidity: 55,
    co2: 500, 
    soilMoisture: 3500,
    light: 12000,
    species: 4,
};

const environmentalSensors = [
    { key: 'temperature', label: 'Temperatura', unit: '°C', icon: 'thermometer-outline' },
    { key: 'airHumidity', label: 'Humedad', unit: '%', icon: 'water-outline' },
    { key: 'co2', label: 'Nivel CO2', unit: ' ppm', icon: 'leaf-outline' },
    { key: 'soilMoisture', label: 'Suelo', unit: ' RAW', icon: 'pin-outline' },
    { key: 'light', label: 'Luz', unit: ' Lux', icon: 'sunny-outline' },
    { key: 'species', label: 'Especies', unit: '', icon: 'flower-outline' },
];

const DashboardScreen = () => {
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    const { 
        PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE, 
        LIGHT_COLOR, SECUNDARY_COLOR 
    } = AppColors;

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
        const handlePress = () => {
            if (isAvailable) {
                navigation.navigate('Home', { 
                    screen: 'Stats',  
                    params: {
                        metricName: label,
                        metricUnit: unit.trim(),
                        metricKey: metricKey,
                    }
                });
            }
        };

        return (
            <TouchableOpacity 
                key={metricKey}
                style={styles.conditionItem} 
                onPress={handlePress}
                disabled={!isAvailable}
            >
                <View style={styles.conditionIconArea}>
                    <Ionicons name={iconName} size={30} color={AppColors.PRIMARY_COLOR} />
                </View>
                <Text style={styles.conditionLabel}>{displayLabel}</Text>
                <Text style={styles.conditionValue}>{displayValue}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
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
                <Text style={styles.mainTitle}>SIIT40</Text>
                <View style={styles.subtitleRow}>
                    <Text style={styles.mainSubtitle}>Sistema de invernadero inteligente con tecnología 4.0</Text>
                </View>
                <Text style={styles.sectionTitle}>Sensores y ambiente</Text>                
                <View style={styles.conditionsGrid}>
                    {environmentalSensors.map((sensor) => (
                        renderConditionPill(
                            sensor.icon as keyof typeof Ionicons.glyphMap,
                            sensor.label,
                            mockEnvironmentalData[sensor.key as keyof EnvironmentalData],
                            sensor.unit,
                            sensor.key as keyof EnvironmentalData
                        )
                    ))}
                </View>
                <Text style={styles.sectionTitle}>Especies</Text>
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
        color: "#CDCDCD",
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
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    conditionItem: {
        width: GRID_ITEM_WIDTH, 
        height: 130,
        backgroundColor: AppColors.WHITE,
        marginBottom: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: AppColors.PRIMARY_COLOR,
    },
    conditionIconArea: {
        marginBottom: 10,
    },
    conditionLabel: {
        fontSize: 12,
        fontWeight: '400',
        marginTop: 5,
        flexShrink: 1,
        color: '#B8B7BE' 
    },
    conditionValue: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
        color: AppColors.PRIMARY_COLOR
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: AppColors.DARK_COLOR,
        marginTop: 5,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    speciesListContainer: {
        flex: 1,
        minHeight: 400, 
    },
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