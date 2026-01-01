import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@theme/Colors";
import { LineChart } from "react-native-chart-kit";
import { SensorData } from "@models/SensorData";
import { useHistoryLogs } from "@custom-hooks/logic/useHistoryLogs";
import { useConnectionGuard } from "@custom-hooks/logic/useConnectionGuard";

const { width } = Dimensions.get("window");

const HistoryScreen = () => {
  const [selectedMetric, setSelectedMetric] =
    useState<keyof SensorData>("humedadSuelo");
  const { PRIMARY_COLOR, DARK_COLOR, TEXT_GRAY, WHITE, SECUNDARY_COLOR } =
    AppColors;
  const { isConnected } = useConnectionGuard();
  const { logs, loading } = useHistoryLogs();
  const [selectedLog, setSelectedLog] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const metricsConfig = [
    { key: "humedadSuelo", label: "Suelo", unit: "RAW", icon: "pin-outline" },
    {
      key: "temperatura",
      label: "Temp",
      unit: "°C",
      icon: "thermometer-outline",
    },
    { key: "co2", label: "CO2", unit: "ppm", icon: "leaf-outline" },
    { key: "lux", label: "Luz", unit: "Lux", icon: "sunny-outline" },
  ];

  const stats = useMemo(() => {
    return {
      max: 3500,
      min: 1200,
      avg: 2350,
    };
  }, [selectedMetric]);

  const handleSelectLog = (item: { id: string; label: string }) => {
    setSelectedLog(item);
    setShowPicker(false);
  };

  const chartConfig = {
    backgroundColor: WHITE,
    backgroundGradientFrom: WHITE,
    backgroundGradientTo: WHITE,
    decimalPlaces: 0,
    color: (opacity = 1) => PRIMARY_COLOR,
    labelColor: (opacity = 1) => DARK_COLOR,
    propsForDots: { r: "4", strokeWidth: "2", stroke: PRIMARY_COLOR },
    propsForLabels: { fontSize: 10 },
  };

  const chartData = {
    labels: ["08:00", "10:00", "12:00", "14:00", "16:00"],
    datasets: [
      {
        data: [2000, 3200, 2800, 1500, 3500],
        color: (opacity = 1) => PRIMARY_COLOR,
        strokeWidth: 3,
      },
      {
        data: [1800, 2900, 2500, 1200, 3100],
        color: (opacity = 1) => "#D1F700",
        strokeWidth: 3,
      },
    ],
    legend: ["Zona A", "Zona B"],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
        <Text style={styles.sectionTitle}>Registros Disponibles</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => setShowPicker(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="calendar" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.pickerTriggerText}>
                  {selectedLog ? selectedLog.label : "Seleccionar fecha"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={TEXT_GRAY} />
            </>
          )}
        </TouchableOpacity>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Monitoreo de {selectedMetric.toUpperCase()}
          </Text>
          <LineChart
            data={chartData}
            width={width - 50}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.metricsGrid}>
          {metricsConfig.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.metricBtn,
                selectedMetric === item.key && {
                  backgroundColor: PRIMARY_COLOR,
                },
              ]}
              onPress={() => setSelectedMetric(item.key as keyof SensorData)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={selectedMetric === item.key ? WHITE : PRIMARY_COLOR}
              />
              <Text
                style={[
                  styles.metricBtnText,
                  selectedMetric === item.key && { color: WHITE },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Análisis del Día</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Máximo</Text>
            <Text style={styles.summaryValue}>{stats.max}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Mínimo</Text>
            <Text style={styles.summaryValue}>{stats.min}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promedio</Text>
            <Text style={styles.summaryValue}>{stats.avg}</Text>
          </View>
        </View>
      </ScrollView>
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Log</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={DARK_COLOR} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={50}
                    color={TEXT_GRAY}
                  />
                  <Text style={styles.emptyText}>
                    No se encontraron registros
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {isConnected
                      ? "El ESP32 no tiene archivos en la SD."
                      : "Conéctate al invernadero para sincronizar la lista."}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.logOption}
                  onPress={() => handleSelectLog(item)}
                >
                  <Text style={styles.logOptionText}>{item.label}</Text>
                  {selectedLog?.id === item.id && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={PRIMARY_COLOR}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.WHITE },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.DARK_COLOR,
    marginBottom: 12,
  },
  logsList: { marginBottom: 20 },
  logPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: AppColors.LIGHT_COLOR,
  },
  logPillText: {
    fontSize: 12,
    color: AppColors.DARK_COLOR,
    marginLeft: 5,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.DARK_COLOR,
    textAlign: "center",
    marginBottom: 10,
  },
  chart: { borderRadius: 20, marginLeft: -15 },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  metricBtn: {
    width: (width - 60) / 4,
    backgroundColor: AppColors.WHITE,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
  },
  metricBtnText: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
    color: AppColors.PRIMARY_COLOR,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: AppColors.DARK_COLOR,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryLabel: { color: AppColors.LIGHT_COLOR, fontSize: 11, marginBottom: 5 },
  summaryValue: { fontSize: 16, fontWeight: "bold", color: AppColors.WHITE },
  summaryDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AppColors.WHITE,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: AppColors.LIGHT_COLOR,
    marginBottom: 20,
    elevation: 2,
  },
  pickerTriggerText: {
    marginLeft: 10,
    fontSize: 16,
    color: AppColors.PRIMARY_COLOR,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: AppColors.DARK_COLOR },
  logOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  logOptionText: { fontSize: 16, color: AppColors.DARK_COLOR },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.DARK_COLOR,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: AppColors.TEXT_GRAY,
    textAlign: "center",
    marginTop: 5,
  },
});
