import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@theme/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // (Ancho total - Padding de ambos lados) / 2

// --- MOCK DATA de Actuadores ---
// Estos datos simulan el estado actual reportado por el ESP32
const mockActuators = {
    valveA: { status: 'ABIERTA', isManual: true, flow: '0.5 L/min' }, // R1/R3
    valveB: { status: 'CERRADA', isManual: false, flow: '0.0 L/min' }, // R2/R3
    camera1: { status: 'ACTIVA', lastPicture: '10:20 AM' },
    window: { status: 'CERRADA', temp: '28°C' },
};

const ControlScreen = () => {
    const { 
        PRIMARY_COLOR, SECUNDARY_COLOR, DARK_COLOR, 
        TEXT_GRAY, WHITE, 
        STATUS_DANGER, LIGHT_COLOR
    } = AppColors;

    // Función para renderizar una tarjeta de control (similar al Dashboard)
    const renderActuatorCard = (
        title: string, 
        subtitle: string, 
        iconName: keyof typeof Ionicons.glyphMap, 
        isActive: boolean, 
        onPress: () => void
    ) => {
        // Tarjeta oscura para actuadores importantes o si están encendidos/activos
        const isDark = isActive; 

        const bgColor = isDark ? DARK_COLOR : WHITE;
        const titleColor = isDark ? WHITE : DARK_COLOR;
        const subtitleColor = isDark ? TEXT_GRAY : TEXT_GRAY;
        const iconColor = isDark ? SECUNDARY_COLOR : PRIMARY_COLOR; 
        
        // Determina el estado del toggle
        const toggleColor = isActive ? PRIMARY_COLOR : LIGHT_COLOR;

        return (
            <TouchableOpacity 
                style={[styles.controlCard, { backgroundColor: bgColor }]}
                onPress={onPress}
            >
                <View style={styles.controlIconContainer}>
                    <Ionicons name={iconName} size={28} color={iconColor} />
                    {/* Placeholder para el Toggle */}
                    <View style={[styles.togglePlaceholder, {backgroundColor: toggleColor}]} />
                </View>
                <Text style={[styles.controlTitle, { color: titleColor }]}>{title}</Text>
                <Text style={[styles.controlSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContent}>
                
                {/* Título Principal */}
                <Text style={styles.mainTitle}>Control de Actuadores</Text>
                <Text style={styles.mainSubtitle}>
                    {/* Ejemplo de un indicador de resumen */}
                    <Ionicons name="alert-circle-outline" size={16} color={STATUS_DANGER} /> 
                    {' '}2 actuadores requieren atención.
                </Text>

                {/* === SECCIÓN VÁLVULAS (R1, R2, R3) === */}
                <Text style={styles.sectionTitle}>Válvulas Solenoide (Riego)</Text>
                <View style={styles.controlGrid}>
                    
                    {/* CARD 1: Válvula Zona A (R1) */}
                    {renderActuatorCard(
                        "Zona A",
                        `Flujo: ${mockActuators.valveA.flow} | ${mockActuators.valveA.status}`,
                        "water-sharp",
                        mockActuators.valveA.status === 'ABIERTA', // Es activo si está abierta
                        () => console.log('Toggle Válvula A')
                    )}

                    {/* CARD 2: Válvula Zona B (R2) */}
                    {renderActuatorCard(
                        "Zona B",
                        `Flujo: ${mockActuators.valveB.flow} | ${mockActuators.valveB.status}`,
                        "water-sharp",
                        mockActuators.valveB.status === 'ABIERTA',
                        () => console.log('Toggle Válvula B')
                    )}
                </View>

                {/* === SECCIÓN CÁMARAS (Visualización) === */}
                <Text style={styles.sectionTitle}>Monitoreo Visual (Cámaras)</Text>
                <View style={styles.controlGrid}>
                    
                    {/* CARD 3: Cámara 1 (Tomar Foto) */}
                    {renderActuatorCard(
                        "Cámara 1 / Nodo",
                        `Última Foto: ${mockActuators.camera1.lastPicture}`,
                        "camera-outline",
                        mockActuators.camera1.status === 'ACTIVA',
                        () => console.log('Tomar Foto Cámara 1')
                    )}

                    {/* CARD 4: Ventanas (Abrir/Cerrar) */}
                    {renderActuatorCard(
                        "Ventanas",
                        `Temperatura ${mockActuators.window.temp} | ${mockActuators.window.status}`,
                        "contract-outline",
                        mockActuators.window.status === 'ABIERTA',
                        () => console.log('Toggle Ventanas')
                    )}
                </View>

                {/* Placeholder para más controles (ej: Luces, Nebulización) */}
                <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>
                        Aquí irá el control para Luces, Nebulización, etc.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ControlScreen;

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
        marginBottom: 15,
    },

    // --- Cuadrícula de Control ---
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
    controlTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 'auto', 
    },
    controlSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 5,
    },
    
    // --- Placeholder Adicional ---
    placeholderCard: {
        height: 100,
        backgroundColor: AppColors.LIGHT_COLOR,
        opacity: 0.6,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: AppColors.PRIMARY_COLOR,
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: AppColors.DARK_COLOR,
        fontWeight: 'bold',
    },
});