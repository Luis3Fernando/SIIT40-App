import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useHistorySync } from '@custom-hooks/logic/useHistorySync';
import { useCloudSync } from '@custom-hooks/logic/useCloudSync';
import { useConnectionGuard } from '@custom-hooks/logic/useConnectionGuard';
import { HistoryBackupStorage } from '@storage/HistoryBackupStorage';
import { LocalBackupLog } from '@models/FileMetadata';

const SyncScreen = () => {
    const { PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE, STATUS_DANGER, LIGHT_COLOR, STATUS_SUCCESS } = AppColors;
    const { isConnected: isWifiConnected } = useConnectionGuard();
    const { syncWithHardware, isDownloading, syncProgress } = useHistorySync();
    const { uploadPendingLogs, isSyncing: isCloudLoading } = useCloudSync();
    const [localLogs, setLocalLogs] = useState<LocalBackupLog[]>([]);
    const refreshLocalData = useCallback(async () => {
        const logs = await HistoryBackupStorage.getBackupLogs();
        setLocalLogs(logs);
    }, []);
    useEffect(() => { 
        refreshLocalData(); 
    }, [isDownloading, isCloudLoading, refreshLocalData]);

    const pendingCloudCount = localLogs.filter(l => !l.isSyncedToCloud).length;

    const handleHardwareSync = async () => {
        const result = await syncWithHardware();
        if (result.success) {
            Alert.alert("Éxito", result.message);
        } else {
            Alert.alert("Error de Sincronización", result.message);
        }
        refreshLocalData();
    };

    const handleCloudSync = async () => {
        await uploadPendingLogs(localLogs);
        refreshLocalData();
    };

    const renderActionButton = (
        title: string,
        subtitle: string,
        iconName: keyof typeof Ionicons.glyphMap,
        bgColor: string,
        onPress: () => void,
        isLoading: boolean,
        disabled: boolean
    ) => (
        <TouchableOpacity
            style={[
                styles.actionButton, 
                { backgroundColor: disabled ? LIGHT_COLOR : bgColor, opacity: disabled ? 0.6 : 1 }
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={WHITE} size="small" />
            ) : (
                <Ionicons name={iconName} size={28} color={WHITE} />
            )}
            <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>{title}</Text>
                <Text style={[styles.buttonSubtitle, { color: WHITE, opacity: 0.8 }]}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
                <Text style={styles.mainTitle}>Sincronización</Text>
                <View style={[styles.statusPill, { borderColor: isWifiConnected ? PRIMARY_COLOR : STATUS_DANGER }]}>
                    <Ionicons
                        name={isWifiConnected ? "wifi" : "cloud-offline-outline"}
                        size={20}
                        color={isWifiConnected ? PRIMARY_COLOR : STATUS_DANGER}
                    />
                    <Text style={styles.statusPillText}>
                        Estado: 
                        <Text style={{ fontWeight: '700', color: isWifiConnected ? PRIMARY_COLOR : STATUS_DANGER }}>
                            {isWifiConnected ? ' Conectado al Invernadero' : ' Modo Desconectado'}
                        </Text>
                    </Text>
                </View>
                <Text style={styles.sectionTitle}>Resumen de Datos</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Archivos en el Teléfono:</Text>
                        <Text style={styles.infoValue}>{localLogs.length}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Pendientes de Nube:</Text>
                        <Text style={[styles.infoValue, { color: pendingCloudCount > 0 ? STATUS_DANGER : STATUS_SUCCESS }]}>
                            {pendingCloudCount}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Acciones</Text>
                {renderActionButton(
                    "Sincronizar Invernadero",
                    isDownloading ? `Progreso: ${syncProgress}%` : "Descargar nuevos registros de la SD",
                    "download-outline",
                    DARK_COLOR,
                    handleHardwareSync,
                    isDownloading,
                    !isWifiConnected
                )}
                {renderActionButton(
                    "Subir a la Nube",
                    isCloudLoading ? "Conectando con Sysari..." : `${pendingCloudCount} archivos listos para backup`,
                    "cloud-upload-outline",
                    PRIMARY_COLOR,
                    handleCloudSync,
                    isCloudLoading,
                    pendingCloudCount === 0
                )}
                <Text style={styles.sectionTitle}>Logs en este dispositivo</Text>
                <View style={styles.historyContainer}>
                    {localLogs.length > 0 ? (
                        localLogs.slice().reverse().map((log, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Ionicons
                                    name={log.isSyncedToCloud ? "cloud-done" : "cloud-offline"}
                                    size={24}
                                    color={log.isSyncedToCloud ? STATUS_SUCCESS : TEXT_GRAY}
                                    style={{ marginRight: 15 }}
                                />
                                <View style={styles.historyTextContent}>
                                    <Text style={styles.historyTimestamp}>{log.fileName}</Text>
                                    <Text style={styles.historyStatus}>
                                        {log.data.length} registros | {log.isComplete ? 'Día completo' : 'En curso'}
                                    </Text>
                                </View>
                                {log.isSyncedToCloud && <Ionicons name="checkmark-circle" size={16} color={STATUS_SUCCESS} />}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.secondaryLabel}>No hay datos locales. Conéctate al ESP32 para descargar.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SyncScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: AppColors.WHITE },
    scrollViewContent: { paddingHorizontal: 20, paddingTop: 10 },
    mainTitle: { fontSize: 26, fontWeight: '700', color: AppColors.DARK_COLOR, marginBottom: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: AppColors.DARK_COLOR, marginTop: 15, marginBottom: 10 },
    statusPill: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#F8F9FA', marginBottom: 20, borderWidth: 1 },
    statusPillText: { fontSize: 14, color: AppColors.DARK_COLOR, marginLeft: 10 },
    infoCard: { backgroundColor: AppColors.WHITE, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    infoLabel: { fontSize: 14, color: AppColors.TEXT_GRAY, fontWeight: '500' },
    infoValue: { fontSize: 14, fontWeight: '700', color: AppColors.DARK_COLOR },
    actionButton: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 18, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    buttonTextContainer: { marginLeft: 15, flex: 1 },
    buttonTitle: { color: AppColors.WHITE, fontWeight: '700', fontSize: 16 },
    buttonSubtitle: { fontSize: 12, marginTop: 2 },
    historyContainer: { marginBottom: 30, padding: 5 },
    historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    historyTextContent: { flex: 1 },
    historyTimestamp: { fontSize: 15, fontWeight: '600', color: AppColors.DARK_COLOR },
    historyStatus: { fontSize: 12, color: AppColors.TEXT_GRAY, marginTop: 2 },
    secondaryLabel: { fontSize: 12, color: AppColors.TEXT_GRAY, marginTop: 10, textAlign: 'center' }
});