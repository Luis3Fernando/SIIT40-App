import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppColors } from '@theme/Colors'; 
import SpecieCard from '@components/SpecieCard'; // Importamos el componente modularizado

// --- TIPADO Y DATOS (Definidos aquí, donde se gestiona la lista) ---
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

// Datos Mock con el campo de Zona
const mockSpecies: PlantData[] = [
    {
        id: 1, name: 'Tomate', scientificName: 'Solanum lycopersicum', count: 120,
        stage: 'Reproductivo', zone: 'Zona A', isCritical: false,
        imageUrl: 'https://placehold.co/60x60/FF6347/FFFFFF?text=T', color: AppColors.PRIMARY_COLOR,
    },
    {
        id: 2, name: 'Maíz', scientificName: 'Zea mays', count: 150,
        stage: 'Crecimiento', zone: 'Zona B', isCritical: false,
        imageUrl: 'https://placehold.co/60x60/FBC02D/FFFFFF?text=M', color: AppColors.LIGHT_COLOR,
    },
    {
        id: 3, name: 'Maní', scientificName: 'Arachis hypogaea', count: 95,
        stage: 'Maduración', zone: 'Zona A', isCritical: true,
        imageUrl: 'https://placehold.co/60x60/083731/FFFFFF?text=P', color: AppColors.DARK_COLOR,
    },
    {
        id: 4, name: 'Pimiento', scientificName: 'Capsicum', count: 60,
        stage: 'Reproductivo', zone: 'Zona B', isCritical: false,
        imageUrl: 'https://placehold.co/60x60/FFD700/FFFFFF?text=P', color: AppColors.PRIMARY_COLOR,
    },
    {
        id: 5, name: 'Papa', scientificName: 'Solanum tuberosum', count: 70,
        stage: 'Crecimiento', zone: 'Zona C', isCritical: false,
        imageUrl: 'https://placehold.co/60x60/C0C0C0/333333?text=P', color: AppColors.LIGHT_COLOR,
    },
];

// Componente principal de la lista con la cabecera de filtros
const ListSpecies = () => {
    // Estado para gestionar la pestaña activa (Todo, Zona A, Zona B, etc.)
    const [activeTab, setActiveTab] = useState<'Todo' | PlantZone>('Todo'); 
    
    // Lista de pestañas para el filtro
    const tabs: Array<'Todo' | PlantZone> = ['Todo', 'Zona A', 'Zona B', 'Zona C'];

    // Lógica de Filtrado
    const filteredSpecies = mockSpecies.filter(plant => {
        if (activeTab === 'Todo') {
            return true;
        }
        return plant.zone === activeTab;
    });

    // Función para renderizar la cabecera de pestañas (Tabs)
    const renderTabHeader = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabHeaderContainer}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                const tabColor = isActive ? AppColors.DARK_COLOR : AppColors.TEXT_GRAY;
                const tabBorderColor = isActive ? AppColors.PRIMARY_COLOR : 'transparent';

                return (
                    <TouchableOpacity 
                        key={tab}
                        style={styles.tabPill}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, { color: tabColor }]}>
                            {tab}
                        </Text>
                        {/* Indicador de línea activa */}
                        <View style={[styles.tabIndicator, { backgroundColor: tabBorderColor }]} />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    return (
        <View style={styles.listContainer}>
            {/* Cabecera de Pestañas */}
            {renderTabHeader()}

            {/* Lista Filtrada de Especies */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredSpecies.length > 0 ? (
                    filteredSpecies.map((species) => (
                        // USO DEL COMPONENTE MODULARIZADO (SpecieCard)
                        <SpecieCard 
                            key={species.id} 
                            item={species} 
                            onPress={() => console.log('Navegar a detalles de:', species.name)}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No hay plantas registradas en la {activeTab}.</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default ListSpecies;

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: AppColors.WHITE,
    },
    scrollContent: {
        paddingHorizontal: 20, 
        paddingTop: 10,
    },

    // --- Estilos de la Cabecera de Tabs ---
    tabHeaderContainer: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.LIGHT_COLOR,
        paddingLeft: 20,
    },
    tabPill: {
        marginRight: 20,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        borderRadius: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: AppColors.TEXT_GRAY,
    },
    // Nota: Los estilos de 'cardContainer', 'imagePlaceholder', etc.,
    // han sido movidos a SpecieCard.tsx. Mantenemos solo los estilos del contenedor
    // y del sistema de pestañas aquí.
});