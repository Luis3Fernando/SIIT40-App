import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA de Conexión ---
const mockConnection = {
    // Estado del Wi-Fi del teléfono (Debe ser SIIT40_AP)
    currentSSID: 'SIIT40_AP', 
    targetSSID: 'SIIT40_AP',

    // Estado de la comunicación HTTP con el ESP32
    apiStatus: 'OK', // 'OK', 'UNSTABLE', 'ERROR'
    
    // Detalles de conexión (Atributos necesarios)
    esp32IP: '192.168.4.1',
    esp32Port: 80,
    lastAttempt: 'Hace 5 segundos',
};

const ConnectionScreen = () => {
    const { 
        PRIMARY_COLOR, SECUNDARY_COLOR, DARK_COLOR, 
        TEXT_GRAY, WHITE, 
        STATUS_DANGER, LIGHT_COLOR 
    } = AppColors;

    // --- Lógica de Estado de Conexión al ESP32 ---
    const getOverallStatus = (): { status: string; color: string; icon: keyof typeof Ionicons.glyphMap } => {
        if (mockConnection.currentSSID !== mockConnection.targetSSID) {
            return { status: 'DESCONECTADO', color: STATUS_DANGER, icon: 'menu' };
        }
        if (mockConnection.apiStatus === 'OK') {
            return { status: 'CONEXIÓN ESTABLE', color: PRIMARY_COLOR, icon: 'wifi' };
        }
        if (mockConnection.apiStatus === 'UNSTABLE') {
            return { status: 'CONEXIÓN INESTABLE', color: SECUNDARY_COLOR, icon: 'alert-circle' };
        }
        return { status: 'ERROR DE COMUNICACIÓN', color: STATUS_DANGER, icon: 'warning' };
    };

    const overallStatus = getOverallStatus();

    // Función para renderizar una tarjeta de diagnóstico de paso
    const renderStepPill = (title: string, subtitle: string, isOk: boolean, icon: keyof typeof Ionicons.glyphMap) => {
        const statusColor = isOk ? PRIMARY_COLOR : STATUS_DANGER;
        return (
            <View style={styles.stepPill}>
                <Ionicons name={icon} size={24} color={statusColor} />
                <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: DARK_COLOR }]}>{title}</Text>
                    <Text style={[styles.stepSubtitle, { color: TEXT_GRAY }]}>{subtitle}</Text>
                </View>
                <Ionicons 
                    name={isOk ? "checkmark-circle" : "close-circle"} 
                    size={24} 
                    color={statusColor} 
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
                
                <Text style={styles.mainTitle}>Diagnóstico de Conexión</Text>
                <Text style={styles.mainSubtitle}>
                    {/* Indicador C1 y C2 */}
                    Verifica la comunicación con el módulo ESP32 Padre.
                </Text>

                {/* === 1. INDICADOR GENERAL DE ESTADO (C2) === */}
                <View style={[styles.overallCard, { backgroundColor: overallStatus.color }]}>
                    <Ionicons name={overallStatus.icon} size={30} color={WHITE} />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.overallTitle}>Estado del Enlace</Text>
                        <Text style={styles.overallStatusText}>{overallStatus.status}</Text>
                    </View>
                </View>

                {/* === 2. DETALLES DE DIAGNÓSTICO === */}
                <Text style={styles.sectionTitle}>Pasos de Verificación</Text>
                
                {/* Paso 1: Conexión al Punto de Acceso (C1) */}
                {renderStepPill(
                    "Paso 1: Red Wi-Fi (AP)",
                    `Actual: ${mockConnection.currentSSID} | Requerido: ${mockConnection.targetSSID}`,
                    mockConnection.currentSSID === mockConnection.targetSSID,
                    "globe-outline"
                )}

                {/* Paso 2: Comunicación HTTP (API) */}
                {renderStepPill(
                    "Paso 2: Respuesta del ESP32",
                    `IP: ${mockConnection.esp32IP}:${mockConnection.esp32Port} | Último Intento: ${mockConnection.lastAttempt}`,
                    mockConnection.apiStatus === 'OK' || mockConnection.apiStatus === 'UNSTABLE',
                    "server-outline"
                )}
                
                {/* === 3. DETALLES TÉCNICOS Y DATA FLOW === */}
                <Text style={styles.sectionTitle}>Detalles Técnicos</Text>

                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>IP de Enlace Directo (Gateway):</Text>
                        <Text style={styles.detailValue}>{mockConnection.esp32IP}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Flujo de Datos:</Text>
                        <Text style={styles.detailValueFlow}>Envío (Actuadores) y Recepción (Sensores)</Text>
                    </View>
                </View>


                {/* === 4. ACCIONES (RECONEXIÓN) === */}
                <Text style={styles.sectionTitle}>Acciones</Text>

                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => console.log('Reintentar Conexión')}
                >
                    <Ionicons name="refresh-circle-outline" size={28} color={WHITE} />
                    <Text style={styles.actionButtonText}>REINTENTAR CONEXIÓN Y DIAGNÓSTICO</Text>
                </TouchableOpacity>

                {/* Botón de Ayuda (si el SSID no coincide) */}
                {mockConnection.currentSSID !== mockConnection.targetSSID && (
                    <TouchableOpacity style={styles.helpButton}>
                        <Ionicons name="settings-outline" size={20} color={DARK_COLOR} />
                        <Text style={styles.helpButtonText}>Abrir Ajustes Wi-Fi del Teléfono</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export default ConnectionScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.WHITE,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    
    // --- Títulos ---
    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: AppColors.DARK_COLOR, 
        marginTop: 5,
        marginBottom: 5,
    },
    mainSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.TEXT_GRAY,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
        marginTop: 15,
        marginBottom: 10,
    },

    // --- Tarjeta General de Estado (Overall Status) ---
    overallCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    overallTitle: {
        color: AppColors.WHITE,
        fontSize: 14,
        fontWeight: '500',
    },
    overallStatusText: {
        color: AppColors.WHITE,
        fontSize: 24,
        fontWeight: '900',
    },

    // --- Pasos de Diagnóstico (Pills) ---
    stepPill: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        backgroundColor: AppColors.LIGHT_COLOR,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: AppColors.PRIMARY_COLOR,
    },
    stepContent: {
        flex: 1,
        marginLeft: 15,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    stepSubtitle: {
        fontSize: 12,
        color: AppColors.TEXT_GRAY,
        marginTop: 2,
    },

    // --- Detalles Técnicos (Card) ---
    detailsCard: {
        backgroundColor: AppColors.WHITE,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.LIGHT_COLOR,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: AppColors.TEXT_GRAY,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
    },
    detailValueFlow: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.LIGHT_COLOR,
    },

    // --- Botón de Acción Principal ---
    actionButton: {
        backgroundColor: AppColors.DARK_COLOR,
        padding: 18,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    actionButtonText: {
        color: AppColors.WHITE,
        fontWeight: '700',
        fontSize: 18,
        marginLeft: 15,
    },
    
    // --- Botón Secundario de Ayuda ---
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: AppColors.LIGHT_COLOR,
    },
    helpButtonText: {
        color: AppColors.DARK_COLOR,
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 10,
    },
});