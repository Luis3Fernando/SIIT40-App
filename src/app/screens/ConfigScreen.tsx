import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@theme/Colors";
import { useSpeciesCatalog } from "@custom-hooks/logic/useSpeciesCatalog";
import { usePlants } from "@custom-hooks/logic/usePlants";
import { useZoneConfig } from "@custom-hooks/logic/useZoneConfig";
import { Species, PlantData, PlantZone } from "@models/PlantData";

const ConfigScreen = () => {
  const { PRIMARY_COLOR, DARK_COLOR, WHITE, TEXT_GRAY, LIGHT_COLOR } =
    AppColors;
  const LeafPlaceholder = require("../../assets/icon/hoja.png");
  const { species, loading: loadingCatalog } = useSpeciesCatalog();
  const { addPlantLocal } = usePlants();
  const { addPlantToZone, isUpdating } = useZoneConfig();
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleAssignToZone = async (zone: PlantZone) => {
    if (!selectedSpecies) return;
    await addPlantToZone(selectedSpecies, zone);
    const newPlantEntry: PlantData = {
      ...selectedSpecies,
      id: Date.now(),
      zone: zone,
      stage: "Crecimiento",
      count: 1,
      isCritical: false,
    };
    await addPlantLocal(newPlantEntry);

    setModalVisible(false);
    setSelectedSpecies(null);
  };

  const renderSpeciesItem = ({ item }: { item: Species }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedSpecies(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={
          item.imageUrl === "local_asset_leaf"
            ? LeafPlaceholder
            : { uri: item.imageUrl }
        }
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.speciesName}>{item.name}</Text>
        <Text style={styles.scientificName}>{item.scientificName}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{item.vol}L</Text>
          <Text style={styles.badge}>{item.freq}h</Text>
        </View>
      </View>
      <Ionicons name="add-circle" size={30} color={PRIMARY_COLOR} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Cultivos</Text>
        <Text style={styles.subtitle}>
          Selecciona una especie para configurar tu zona de riego.
        </Text>
      </View>

      {loadingCatalog ? (
        <ActivityIndicator
          size="large"
          color={PRIMARY_COLOR}
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={species}
          keyExtractor={(item) => item.speciesId.toString()}
          renderItem={renderSpeciesItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSpecies && (
              <>
                <Text style={styles.modalTitle}>
                  Asignar {selectedSpecies.name}
                </Text>
                <Text style={styles.modalSubtitle}>
                  ¿A qué zona del invernadero deseas agregar este cultivo?
                </Text>

                <View style={styles.zoneButtonsRow}>
                  <TouchableOpacity
                    style={[styles.zoneBtn, { borderColor: PRIMARY_COLOR }]}
                    onPress={() => handleAssignToZone("Zona A")}
                    disabled={isUpdating}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={24}
                      color={PRIMARY_COLOR}
                    />
                    <Text style={styles.zoneBtnText}>ZONA A</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.zoneBtn,
                      { borderColor: AppColors.SECUNDARY_COLOR },
                    ]}
                    onPress={() => handleAssignToZone("Zona B")}
                    disabled={isUpdating}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={24}
                      color={DARK_COLOR}
                    />
                    <Text style={styles.zoneBtnText}>ZONA B</Text>
                  </TouchableOpacity>
                </View>

                {isUpdating && (
                  <ActivityIndicator
                    color={PRIMARY_COLOR}
                    style={{ marginVertical: 10 }}
                  />
                )}

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: AppColors.DARK_COLOR },
  subtitle: { fontSize: 14, color: AppColors.TEXT_GRAY, marginTop: 5 },
  listContent: { padding: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  speciesName: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.DARK_COLOR,
  },
  scientificName: {
    fontSize: 12,
    fontStyle: "italic",
    color: AppColors.TEXT_GRAY,
  },
  badgeRow: { flexDirection: "row", marginTop: 5 },
  badge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: AppColors.DARK_COLOR },
  modalSubtitle: {
    textAlign: "center",
    color: AppColors.TEXT_GRAY,
    marginVertical: 15,
  },
  zoneButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  zoneBtn: {
    flex: 0.48,
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  zoneBtnText: { marginTop: 10, fontWeight: "bold", fontSize: 14 },
  cancelBtn: { padding: 10 },
  cancelBtnText: { color: AppColors.STATUS_DANGER, fontWeight: "600" },
});
