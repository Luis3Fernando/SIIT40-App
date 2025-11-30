import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@theme/Colors'; 

// --- Tipado necesario para que la tarjeta sea independiente ---
type PlantStage = 'Reproductivo' | 'Crecimiento' | 'Maduración';
type PlantZone = 'Zona A' | 'Zona B' | 'Zona C';

interface PlantData {
    id: number;
    name: string;
    scientificName: string;
    count: number;
    stage: PlantStage;
    zone: PlantZone;
    isCritical: boolean;
    imageUrl: string;
    color: string;
}

interface SpecieCardProps {
    item: PlantData;
    onPress: () => void;
}

// Componente individual de la Tarjeta de Especie
const SpecieCard = ({ item, onPress }: SpecieCardProps) => {
    
    // Asignación de colores basada en el estado (usando los nombres de tu paleta)
    const bgColor = item.isCritical ? AppColors.DARK_COLOR : AppColors.WHITE;
    const titleColor = item.isCritical ? AppColors.WHITE : AppColors.DARK_COLOR;
    const subColor = AppColors.TEXT_GRAY; 
    
    // Usamos el color de acento (SECUNDARY_COLOR) para la etiqueta, 
    // y el primario (PRIMARY_COLOR) si es crítico (para el fondo oscuro)
    const tagColor = item.isCritical ? AppColors.PRIMARY_COLOR : AppColors.SECUNDARY_COLOR; 

    return (
        <TouchableOpacity 
            style={[styles.cardContainer, { backgroundColor: bgColor }]}
            onPress={onPress}
        >
            <View style={styles.imagePlaceholder}>
                <Image 
                    source={{ uri: item.imageUrl }} 
                    style={[styles.imageStyle, { backgroundColor: item.color }]} 
                    resizeMode="cover"
                    onError={(e) => console.log('Image Error:', e.nativeEvent.error)}
                />
            </View>

            <View style={styles.contentArea}>
                {/* Tag de Etapa */}
                <View style={[styles.stagePill, { backgroundColor: tagColor }]}>
                    <Text style={styles.stageText}>{item.stage}</Text>
                </View>

                {/* Título, Subtítulo y Zona */}
                <Text style={[styles.nameText, { color: titleColor }]}>
                    {item.name}
                </Text>
                <Text style={[styles.countText, { color: subColor }]}>
                    {item.count} plantas | Zona: {item.zone.slice(-1)}
                </Text>
            </View>

            {/* Flecha de Navegación */}
            <Ionicons name="chevron-forward-outline" size={24} color={subColor} />
        </TouchableOpacity>
    );
};

export default SpecieCard;

const styles = StyleSheet.create({
    // --- Estilos de la Tarjeta (Específicos para este componente) ---
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: AppColors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        // IMPORTANTE: Asegúrate de que el contenedor principal de la lista
        // (el ScrollView) tenga el paddingHorizontal, no esta tarjeta.
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
        overflow: 'hidden',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    contentArea: {
        flex: 1,
    },

    // --- Estilos de la Etapa (Tag) ---
    stagePill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    stageText: {
        fontSize: 10,
        fontWeight: '700',
        color: AppColors.WHITE,
        textTransform: 'uppercase',
    },

    // --- Estilos de Texto ---
    nameText: {
        fontSize: 18,
        fontWeight: '700',
    },
    countText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    }
});