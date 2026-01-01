import React, { useEffect } from 'react';
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
import { useConnectionGuard } from '@custom-hooks/logic/useConnectionGuard';
import { useRealTimeStatus } from '@custom-hooks/logic/useRealTimeStatus';

type DashboardScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList, 'HomeDashboard'>,
    BottomTabNavigationProp<RootTabParamList>
>;

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 60) / 3;

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
    const { PRIMARY_COLOR, WHITE, DARK_COLOR } = AppColors;
    const { isConnected } = useConnectionGuard();
    const { data: averagedData, loading } = useRealTimeStatus(isConnected ? 15000 : 0);

    const currentEnvData = {
        temperature: averagedData?.temperature ?? null,
        airHumidity: averagedData?.airHumidity ?? null,
        co2: averagedData?.co2 ?? null,
        soilMoisture: averagedData?.soilMoisture ?? null,
        light: averagedData?.light ?? null,
        species: averagedData?.species ?? 4, 
    };

    const renderConditionPill = (
        iconName: keyof typeof Ionicons.glyphMap, 
        label: string, 
        value: string | number | null, 
        unit: string,
        metricKey: string
    ) => {
        const isAvailable = isConnected && value !== null;
        const displayValue = isAvailable ? `${value}${unit}` : 'N/D';

        return (
            <TouchableOpacity 
                key={metricKey}
                style={styles.conditionItem} 
                disabled={!isAvailable}
            >
                <View style={styles.conditionIconArea}>
                    <Ionicons name={iconName} size={30} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.conditionLabel}>{label}</Text>
                <Text style={styles.conditionValue}>{displayValue}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
                <View style={styles.header}>
                    <View style={[styles.tagPill, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
                        <Ionicons 
                            name={isConnected ? "checkmark-circle" : "close-circle"} 
                            size={14} 
                            color={WHITE} 
                            style={{ marginRight: 5 }}
                        />
                        <Text style={styles.tagText}>{isConnected ? 'CONECTADO' : 'DESCONECTADO'}</Text>
                    </View>
                    <Text style={styles.lastUpdateText}>
                        {isConnected ? `Última Act: ${new Date().toLocaleTimeString()}` : 'Sin conexión a SIIT40'}
                    </Text>
                </View>
                <Text style={styles.mainTitle}>SIIT40</Text>
                <View style={styles.subtitleRow}>
                    <Text style={styles.mainSubtitle}>Sistema de invernadero inteligente con tecnología 4.0</Text>
                </View>
                <View style={styles.sectionSubtitle}>
                    <Text style={styles.subTitle}>Sensores y ambiente</Text>
                    {/* <TouchableOpacity 
                        style={styles.historyButton} 
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.historyButtonText}>Ver historial</Text>
                        <Ionicons name="chevron-forward" size={16} color={PRIMARY_COLOR} />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.conditionsGrid}>
                    {environmentalSensors.map((sensor) => (
                        renderConditionPill(
                            sensor.icon as any,
                            sensor.label,
                            currentEnvData[sensor.key as keyof typeof currentEnvData],
                            sensor.unit,
                            sensor.key
                        )
                    ))}
                </View>
                <View style={styles.sectionSubtitle}>
                    <Text style={styles.subTitle}>Especies</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Config')}
                        style={styles.configButton}
                    >
                        <Ionicons name="settings-outline" size={22} color={AppColors.PRIMARY_COLOR} />
                        <Text style={styles.configButtonText}>Gestionar</Text>
                    </TouchableOpacity>
                </View>
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
    subTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: AppColors.DARK_COLOR,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: AppColors.WHITE, 
    },
    historyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.PRIMARY_COLOR,
        marginRight: 2,
    },
    configButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    configButtonText: {
        marginLeft: 5,
        color: AppColors.PRIMARY_COLOR,
        fontWeight: '600',
    },
    sectionSubtitle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
        paddingHorizontal: 20,
    }
});