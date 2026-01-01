import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { AppColors } from '@theme/Colors'; 
import SpecieCard from '@components/SpecieCard';
import { usePlants } from '@custom-hooks/logic/usePlants';
import { PlantZone } from '@models/PlantData';
import { Ionicons } from '@expo/vector-icons';

const ListSpecies = () => {
    const { plants, loading } = usePlants();
    const [activeTab, setActiveTab] = useState<'Todo' | PlantZone>('Todo'); 
    const tabs: Array<'Todo' | PlantZone> = ['Todo', 'Zona A', 'Zona B'];

    const filteredSpecies = plants.filter(plant => {
        if (activeTab === 'Todo') return true;
        return plant.zone === activeTab;
    });

    const renderTabHeader = () => (
        <View style={styles.tabHeaderContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity 
                            key={tab} 
                            style={styles.tabPill} 
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText, 
                                { color: isActive ? AppColors.PRIMARY_COLOR : AppColors.TEXT_GRAY }
                            ]}>
                                {tab}
                            </Text>
                            {isActive && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator color={AppColors.PRIMARY_COLOR} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            {renderTabHeader()}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredSpecies.length > 0 ? (
                    filteredSpecies.map((species) => (
                        <SpecieCard 
                            key={species.id} 
                            item={species} 
                            onPress={() => console.log('Navegar a detalles:', species.name)}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="leaf-outline" size={80} color={AppColors.LIGHT_COLOR} />
                        <Text style={styles.emptyText}>
                            {plants.length === 0 
                                ? "Ninguna planta registrada en el invernadero." 
                                : `No hay plantas registradas en la ${activeTab}.`}
                        </Text>
                    </View>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 20,
    },
    tabHeaderContainer: {
        height: 50,
        backgroundColor: AppColors.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingLeft: 20,
    },
    tabPill: {
        marginRight: 25,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: AppColors.PRIMARY_COLOR,
        borderRadius: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16,
        color: AppColors.TEXT_GRAY,
        lineHeight: 22,
        paddingHorizontal: 40,
    },
});