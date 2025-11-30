import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA para maquetación de Sincronización ---
const mockSync = {
  // Simula el estado de la conexión a internet (no al ESP32, sino al mundo exterior)
  internetStatus: 'CONECTADO', 
  localRecords: 45, // Número de registros esperando subir (D1)
  lastCloudSync: '2024-07-26 10:30 AM', // Última subida exitosa (Auditoría)
  lastDownload: '2024-07-25 08:00 AM', // Última descarga (Backup)
  
  // Lista de Auditoría de Subidas
  history: [
    { id: 1, timestamp: '2024-07-26 10:30 AM', records: 15, status: 'Éxito' },
    { id: 2, timestamp: '2024-07-26 09:00 AM', records: 30, status: 'Éxito' },
    { id: 3, timestamp: '2024-07-25 11:45 PM', records: 10, status: 'Error' },
  ]
};

const SyncScreen = () => {
  const { 
    PRIMARY_COLOR, SECUNDARY_COLOR, DARK_COLOR, 
    TEXT_GRAY, WHITE, 
    STATUS_DANGER, LIGHT_COLOR 
  } = AppColors;

  // Función para renderizar el botón de acción clave (D2)
  const renderActionButton = (
    title: string, 
    subtitle: string, 
    iconName: keyof typeof Ionicons.glyphMap, 
    bgColor: string, 
    onPress: () => void
  ) => (
      <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: bgColor }]}
          onPress={onPress}
      >
          <Ionicons name={iconName} size={28} color={WHITE} />
          <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>{title}</Text>
              <Text style={styles.buttonSubtitle}>{subtitle}</Text>
          </View>
      </TouchableOpacity>
  );

  // Función para renderizar un registro de auditoría
  const renderHistoryItem = (item: typeof mockSync.history[0]) => {
    const isError = item.status === 'Error';
    const statusColor = isError ? STATUS_DANGER : PRIMARY_COLOR;

    return (
        <View key={item.id} style={styles.historyItem}>
            <Ionicons 
                name={isError ? "alert-circle-outline" : "cloud-done-outline"} 
                size={24} 
                color={statusColor} 
                style={{ marginRight: 15 }}
            />
            <View style={styles.historyTextContent}>
                <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
                <Text style={[styles.historyStatus, { color: statusColor }]}>
                    {item.status} ({item.records} reg.)
                </Text>
            </View>
            <Ionicons name="eye-outline" size={20} color={TEXT_GRAY} />
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollViewContent}>
        
        <Text style={styles.mainTitle}>Gestión de Datos (Nube)</Text>
        
        {/* === 1. INDICADOR DE ESTADO DE INTERNET === */}
        <View style={styles.statusPill}>
            <Ionicons 
                name={mockSync.internetStatus === 'CONECTADO' ? "globe-outline" : "warning-outline"} 
                size={20} 
                color={mockSync.internetStatus === 'CONECTADO' ? PRIMARY_COLOR : STATUS_DANGER} 
                style={{ marginRight: 10 }}
            />
            <Text style={styles.statusPillText}>
                Conexión a Internet: 
                <Text style={{ fontWeight: '700', color: mockSync.internetStatus === 'CONECTADO' ? PRIMARY_COLOR : STATUS_DANGER }}> 
                    {' '}{mockSync.internetStatus}
                </Text>
            </Text>
        </View>
        
        {/* === 2. ESTADO LOCAL (D1) === */}
        <Text style={styles.sectionTitle}>Estado de Registros</Text>
        <View style={styles.infoCard}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Registros Locales Pendientes:</Text>
                <Text style={[styles.infoValue, { color: mockSync.localRecords > 0 ? SECUNDARY_COLOR : PRIMARY_COLOR }]}>
                    {mockSync.localRecords}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Última Sincronización:</Text>
                <Text style={styles.infoValue}>{mockSync.lastCloudSync}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Última Descarga:</Text>
                <Text style={styles.infoValue}>{mockSync.lastDownload}</Text>
            </View>
        </View>


        {/* === 3. ACCIONES (Subir/Descargar/Backup) (D2) === */}
        <Text style={styles.sectionTitle}>Acciones de Sincronización</Text>
        
        {/* Botón 1: Subir Datos (Sincronizar) */}
        {renderActionButton(
            "Subir a la Nube (Firebase)",
            `${mockSync.localRecords} registros pendientes de respaldo.`,
            "cloud-upload-outline",
            PRIMARY_COLOR,
            () => console.log('Subir Datos a la Nube')
        )}
        
        {/* Botón 2: Descargar/Restaurar */}
        {renderActionButton(
            "Descargar Último Backup",
            "Obtiene los datos más recientes de la Nube.",
            "cloud-download-outline",
            DARK_COLOR,
            () => console.log('Descargar Backup de la Nube')
        )}

        {/* Botón 3: Backup Local (Simulación) */}
        <TouchableOpacity style={styles.localBackupButton}>
            <Ionicons name="save-outline" size={20} color={DARK_COLOR} />
            <Text style={styles.localBackupText}>Guardar Backup Local (Dispositivo)</Text>
        </TouchableOpacity>


        {/* === 4. AUDITORÍA / HISTORIAL DE SINCRONIZACIÓN === */}
        <Text style={styles.sectionTitle}>Historial de Subidas</Text>
        <View style={styles.historyContainer}>
            {mockSync.history.map(renderHistoryItem)}
            <Text style={styles.secondaryLabel}>
                El historial completo se almacena por 7 días localmente.
            </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SyncScreen;

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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
        marginTop: 15,
        marginBottom: 10,
    },

    // --- Estado de Conexión a Internet ---
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: AppColors.LIGHT_COLOR,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: AppColors.PRIMARY_COLOR,
    },
    statusPillText: {
        fontSize: 14,
        color: AppColors.DARK_COLOR,
    },

    // --- Tarjeta de Información General ---
    infoCard: {
        backgroundColor: AppColors.WHITE,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.LIGHT_COLOR,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.LIGHT_COLOR,
    },
    infoLabel: {
        fontSize: 14,
        color: AppColors.TEXT_GRAY,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.DARK_COLOR,
    },

    // --- Botones de Acción (Subir/Descargar) ---
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonTextContainer: {
        marginLeft: 15,
        flexShrink: 1,
    },
    buttonTitle: {
        color: AppColors.WHITE,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonSubtitle: {
        color: AppColors.TEXT_GRAY, // Gris claro en fondo oscuro
        fontSize: 12,
        marginTop: 2,
    },
    
    // --- Botón de Backup Local ---
    localBackupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: AppColors.LIGHT_COLOR,
        borderWidth: 1,
        borderColor: AppColors.PRIMARY_COLOR,
    },
    localBackupText: {
        color: AppColors.DARK_COLOR,
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 10,
    },

    // --- Historial de Auditoría ---
    historyContainer: {
        marginBottom: 30,
        padding: 10,
        borderRadius: 12,
        backgroundColor: AppColors.WHITE,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.LIGHT_COLOR,
    },
    historyTextContent: {
        flex: 1,
    },
    historyTimestamp: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.DARK_COLOR,
    },
    historyStatus: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    secondaryLabel: {
        fontSize: 12,
        color: AppColors.TEXT_GRAY,
        marginTop: 10,
        textAlign: 'center',
    }
});