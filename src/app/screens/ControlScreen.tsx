import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@theme/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useConnectionGuard } from "@custom-hooks/logic/useConnectionGuard";
import { useRealTimeStatus } from "@custom-hooks/logic/useRealTimeStatus";
import { useIrrigationControl } from "@custom-hooks/logic/useIrrigationControl";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const ControlScreen = () => {
  const {
    PRIMARY_COLOR,
    SECUNDARY_COLOR,
    DARK_COLOR,
    TEXT_GRAY,
    WHITE,
    STATUS_DANGER,
    LIGHT_COLOR,
  } = AppColors;
  const [localStates, setLocalStates] = useState<{ A?: boolean; B?: boolean }>(
    {}
  );
  const [manualAmount, setManualAmount] = useState("5");
  const { isConnected } = useConnectionGuard();
  const { valves, loading } = useRealTimeStatus(isConnected ? 5000 : 0);
  const { startIrrigation, stopIrrigation, isProcessing } =
    useIrrigationControl();

  const getZoneData = (zone: "A" | "B") => {
    const remoteData = valves.find((v) => v.zone === zone) || {
      isOpen: false,
      flowRate: 0,
      totalLitros: 0,
      isManual: false,
    };

    return {
      ...remoteData,
      isOpen:
        localStates[zone] !== undefined ? localStates[zone] : remoteData.isOpen,
    };
  };

  const handleToggle = async (zone: "A" | "B", currentStatus: boolean) => {
    if (!isConnected) return;
    setLocalStates((prev) => ({ ...prev, [zone]: !currentStatus }));

    try {
      if (currentStatus) {
        await stopIrrigation(zone === "A" ? "Zona A" : "Zona B");
      } else {
        const liters = parseInt(manualAmount) || 5;
        await startIrrigation(zone === "A" ? "Zona A" : "Zona B", liters);
      }
    } catch (error) {
      setLocalStates((prev) => ({ ...prev, [zone]: currentStatus }));
    }
  };

  const renderActuatorCard = (
    title: string,
    subtitle: string,
    iconName: keyof typeof Ionicons.glyphMap,
    isActive: boolean,
    isEnabled: boolean,
    onPress: () => void
  ) => {
    const bgColor = !isEnabled ? "#F2F2F2" : isActive ? DARK_COLOR : WHITE;
    const titleColor = !isEnabled ? TEXT_GRAY : isActive ? WHITE : DARK_COLOR;
    const iconColor = !isEnabled
      ? TEXT_GRAY
      : isActive
      ? SECUNDARY_COLOR
      : PRIMARY_COLOR;

    return (
      <TouchableOpacity
        style={[styles.controlCard, { backgroundColor: bgColor }]}
        onPress={onPress}
        disabled={!isEnabled || isProcessing}
      >
        <View style={styles.controlIconContainer}>
          <Ionicons name={iconName} size={28} color={iconColor} />
          <View
            style={[
              styles.toggleTrack,
              {
                backgroundColor: isActive
                  ? PRIMARY_COLOR
                  : isEnabled
                  ? LIGHT_COLOR
                  : "#DDD",
              },
            ]}
          >
            <View
              style={[
                styles.toggleCircle,
                { alignSelf: isActive ? "flex-end" : "flex-start" },
              ]}
            />
          </View>
        </View>
        <View>
          <Text style={[styles.controlTitle, { color: titleColor }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.controlSubtitle,
              {
                color: isEnabled ? (isActive ? TEXT_GRAY : TEXT_GRAY) : "#BBB",
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const zoneA = getZoneData("A");
  const zoneB = getZoneData("B");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollViewContent}>
        <Text style={styles.mainTitle}>Panel de Control</Text>
        <View style={styles.statusInfo}>
          <Ionicons
            name={isConnected ? "radio-outline" : "alert-circle-outline"}
            size={16}
            color={isConnected ? PRIMARY_COLOR : STATUS_DANGER}
          />
          <Text
            style={[
              styles.mainSubtitle,
              { color: isConnected ? PRIMARY_COLOR : STATUS_DANGER },
            ]}
          >
            {isConnected
              ? " Sistema vinculado al ESP32"
              : " Invernadero fuera de línea"}
          </Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputInfo}>
            <Text style={styles.inputLabel}>Volumen de Riego Manual</Text>
            <Text style={styles.inputHelp}>
              Cantidad de litros por activación
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={manualAmount}
              onChangeText={setManualAmount}
              maxLength={2}
            />
            <Text style={styles.unitText}>L</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Válvulas Solenoide</Text>
        <View style={styles.controlGrid}>
          {renderActuatorCard(
            "Zona A",
            `${zoneA.flowRate.toFixed(1)} L/min | ${
              zoneA.isOpen ? "Regando" : "Cerrada"
            }`,
            "water",
            zoneA.isOpen,
            isConnected,
            () => handleToggle("A", zoneA.isOpen)
          )}

          {renderActuatorCard(
            "Zona B",
            `${zoneB.flowRate.toFixed(1)} L/min | ${
              zoneB.isOpen ? "Regando" : "Cerrada"
            }`,
            "water",
            zoneB.isOpen,
            isConnected,
            () => handleToggle("B", zoneB.isOpen)
          )}
        </View>

        <Text style={styles.sectionTitle}>Sistemas Adicionales</Text>
        <View style={styles.controlGrid}>
          {renderActuatorCard(
            "Cámara",
            "No disponible en AP",
            "camera",
            false,
            false,
            () => {}
          )}

          {renderActuatorCard(
            "Ventanas",
            "Módulo desconectado",
            "contract",
            false,
            false,
            () => {}
          )}
        </View>

        {isProcessing && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.loaderText}>Enviando comando...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ControlScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.WHITE },
  scrollViewContent: { paddingHorizontal: 20, paddingTop: 10 },
  mainTitle: { fontSize: 28, fontWeight: "800", color: AppColors.DARK_COLOR },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  mainSubtitle: { fontSize: 13, fontWeight: "600", marginLeft: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.DARK_COLOR,
    marginVertical: 15,
  },
  inputSection: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  inputInfo: { flex: 1 },
  inputLabel: { fontSize: 15, fontWeight: "700", color: AppColors.DARK_COLOR },
  inputHelp: { fontSize: 12, color: AppColors.TEXT_GRAY },
  amountContainer: { flexDirection: "row", alignItems: "center" },
  amountInput: {
    backgroundColor: AppColors.WHITE,
    width: 50,
    height: 40,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.PRIMARY_COLOR,
    borderWidth: 1,
    borderColor: AppColors.LIGHT_COLOR,
  },
  unitText: { marginLeft: 8, fontWeight: "700", color: AppColors.TEXT_GRAY },
  controlGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  controlCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.9,
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.WHITE,
  },
  controlTitle: { fontSize: 17, fontWeight: "700" },
  controlSubtitle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  loaderOverlay: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loaderText: { marginLeft: 10, color: AppColors.TEXT_GRAY, fontWeight: "600" },
});
