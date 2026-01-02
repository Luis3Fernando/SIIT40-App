import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@theme/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useEsp32Status } from "@custom-hooks/logic/useEsp32Status";
import { ESP32_CONFIG } from "@config/esp32";
import { useIrrigationSettings } from "@custom-hooks/logic/useIrrigationSettings";
import { formatTime } from "@utils/time";

const ConnectionScreen = () => {
  const {
    PRIMARY_COLOR,
    SECUNDARY_COLOR,
    DARK_COLOR,
    WHITE,
    STATUS_DANGER,
    STATUS_SUCCESS,
  } = AppColors;

  const { isConnectedToGateway, isApiReachable, currentSSID } = useSelector(
    (state: RootState) => state.connection
  );
  const [refreshing, setRefreshing] = useState(false);
  const { hwStatus, loading, error: hwError, refetch } = useEsp32Status();
  const {
    config,
    loading: loadingCfg,
    refetch: refetchCfg,
  } = useIrrigationSettings();

  useEffect(() => {
    if (isConnectedToGateway) {
      refetch();
      refetchCfg();
    }
  }, [isConnectedToGateway]);

  useEffect(() => {
    if (isConnectedToGateway) refetch();
  }, [isConnectedToGateway]);

  const openWifiSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("App-Prefs:root=WIFI");
    } else {
      Linking.sendIntent("android.settings.WIFI_SETTINGS");
    }
  };

  const onRefresh = useCallback(async () => {
    if (!isConnectedToGateway) return;

    setRefreshing(true);
    await Promise.all([refetch(), refetchCfg()]);

    setRefreshing(false);
  }, [isConnectedToGateway, refetch, refetchCfg]);

  const getStatusHeader = () => {
    if (!isConnectedToGateway)
      return {
        status: "DESCONECTADO",
        color: STATUS_DANGER,
        icon: "wifi-outline" as const,
      };
    if (isApiReachable)
      return {
        status: "CONEXIÓN ESTABLE",
        color: STATUS_SUCCESS,
        icon: "checkmark-done-circle" as const,
      };
    return {
      status: "ERROR DE API",
      color: SECUNDARY_COLOR,
      icon: "alert-circle" as const,
    };
  };

  const overall = getStatusHeader();

  const renderStepPill = (
    title: string,
    subtitle: string,
    isOk: boolean,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View
      style={[
        styles.stepPill,
        { borderLeftColor: isOk ? STATUS_SUCCESS : STATUS_DANGER },
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isOk ? STATUS_SUCCESS : STATUS_DANGER}
      />
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons
        name={isOk ? "checkmark-circle" : "close-circle"}
        size={22}
        color={isOk ? STATUS_SUCCESS : STATUS_DANGER}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.PRIMARY_COLOR]}
            tintColor={AppColors.PRIMARY_COLOR}
            title="Actualizando diagnóstico..."
            titleColor={AppColors.TEXT_GRAY}
          />
        }
      >
        <Text style={styles.mainTitle}>Diagnóstico de Enlace</Text>
        <Text style={styles.mainSubtitle}>
          Estado de comunicación directa con SIIT40 Gateway.
        </Text>

        <View style={[styles.overallCard, { backgroundColor: overall.color }]}>
          <Ionicons name={overall.icon} size={40} color={WHITE} />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.overallTitle}>Estado General</Text>
            <Text style={styles.overallStatusText}>{overall.status}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Verificación de Red</Text>
        {renderStepPill(
          "Capa 1: Enlace Wi-Fi",
          isConnectedToGateway
            ? `Conectado a: ${currentSSID}`
            : "No se detecta la red SIIT40",
          isConnectedToGateway,
          "globe-outline"
        )}

        {renderStepPill(
          "Capa 2: Protocolo HTTP",
          isApiReachable
            ? "Servidor ESP32 respondiendo"
            : "Sin respuesta del endpoint /status",
          isApiReachable,
          "server-outline"
        )}
        <Text style={styles.sectionTitle}>Recetas de Riego (Memoria NVS)</Text>

        {loadingCfg ? (
          <ActivityIndicator color={AppColors.PRIMARY_COLOR} />
        ) : config ? (
          <View style={styles.configContainer}>
            <View style={styles.zoneCard}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneTitle}>Zona A</Text>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: config.A.activa
                        ? AppColors.STATUS_SUCCESS
                        : AppColors.TEXT_GRAY,
                    },
                  ]}
                />
              </View>
              <Text style={styles.configText}>
                Volumen: <Text style={styles.bold}>{config.A.vol}L</Text>
              </Text>
              <Text style={styles.configText}>
                Frecuencia: <Text style={styles.bold}>{config.A.freq}h</Text>
              </Text>
              <Text style={styles.configText}>
                Umbral: <Text style={styles.bold}>{config.A.umbral} RAW</Text>
              </Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>Próximo riego en:</Text>
                <Text style={styles.timerValue}>
                  {config.A.sig_en_seg > 0
                    ? formatTime(config.A.sig_en_seg)
                    : "Iniciando..."}
                </Text>
              </View>
            </View>
            <View style={styles.zoneCard}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneTitle}>Zona B</Text>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: config.B.activa
                        ? AppColors.STATUS_SUCCESS
                        : AppColors.TEXT_GRAY,
                    },
                  ]}
                />
              </View>
              <Text style={styles.configText}>
                Volumen: <Text style={styles.bold}>{config.B.vol}L</Text>
              </Text>
              <Text style={styles.configText}>
                Frecuencia: <Text style={styles.bold}>{config.B.freq}h</Text>
              </Text>
              <Text style={styles.configText}>
                Umbral: <Text style={styles.bold}>{config.B.umbral} RAW</Text>
              </Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>Próximo riego en:</Text>
                <Text style={styles.timerValue}>
                  {config.B.sig_en_seg > 0
                    ? formatTime(config.B.sig_en_seg)
                    : "Iniciando..."}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>
            No se pudo cargar la configuración de riego.
          </Text>
        )}
        <Text style={styles.sectionTitle}>Hardware & Sistema</Text>
        <View style={styles.detailsCard}>
          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator color={PRIMARY_COLOR} />
            </View>
          ) : hwStatus ? (
            <>
              <DetailRow
                label="IP Local ESP32"
                value={ESP32_CONFIG.BASE_URL.replace("http://", "")}
              />
              <DetailRow
                label="Almacenamiento SD"
                value={`${hwStatus.sd_libre_pct}% Libre`}
              />
              <DetailRow
                label="Potencia de Señal"
                value={`${hwStatus.wifi_rssi} dBm`}
              />
              <DetailRow
                label="Tiempo de Actividad"
                value={`${Math.floor(hwStatus.uptime_seg / 3600)}h ${Math.floor(
                  (hwStatus.uptime_seg % 3600) / 60
                )}m`}
              />
            </>
          ) : (
            <Text style={styles.errorText}>
              {hwError ||
                "Requiere conexión para obtener telemetría de sistema"}
            </Text>
          )}
        </View>

        {!isApiReachable && (
          <TouchableOpacity
            style={styles.helpButton}
            onPress={openWifiSettings}
          >
            <Ionicons name="settings-outline" size={20} color={DARK_COLOR} />
            <Text style={styles.helpButtonText}>
              Configurar Wi-Fi del Teléfono
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.refreshButton, { opacity: refreshing ? 0.5 : 1 }]}
          onPress={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={AppColors.PRIMARY_COLOR} />
          ) : (
            <Ionicons
              name="refresh-outline"
              size={20}
              color={AppColors.PRIMARY_COLOR}
            />
          )}
          <Text style={styles.refreshButtonText}>
            {refreshing ? "Cargando..." : "Refrescar Diagnóstico"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.DARK_COLOR,
  },
  mainSubtitle: {
    fontSize: 14,
    color: AppColors.TEXT_GRAY,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.DARK_COLOR,
    marginTop: 20,
    marginBottom: 15,
  },
  overallCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallTitle: {
    color: AppColors.WHITE,
    fontSize: 14,
    fontWeight: "500",
  },
  overallStatusText: {
    color: AppColors.WHITE,
    fontSize: 22,
    fontWeight: "900",
  },
  stepPill: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  stepContent: {
    flex: 1,
    marginLeft: 15,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.DARK_COLOR,
  },
  stepSubtitle: {
    fontSize: 12,
    color: AppColors.TEXT_GRAY,
  },
  configContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  zoneCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  zoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  zoneTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: AppColors.DARK_COLOR,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  configText: {
    fontSize: 12,
    color: AppColors.TEXT_GRAY,
    marginBottom: 4,
  },
  bold: {
    color: AppColors.DARK_COLOR,
    fontWeight: "700",
  },
  timerBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  timerLabel: {
    fontSize: 9,
    color: AppColors.TEXT_GRAY,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  timerValue: {
    fontSize: 13,
    fontWeight: "800",
    color: AppColors.PRIMARY_COLOR,
  },
  detailsCard: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: AppColors.TEXT_GRAY,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.DARK_COLOR,
  },
  errorText: {
    color: AppColors.TEXT_GRAY,
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
    padding: 10,
  },
  centerLoading: {
    padding: 20,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    marginTop: 10,
  },
  helpButtonText: {
    color: AppColors.DARK_COLOR,
    fontWeight: "700",
    marginLeft: 10,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  refreshButtonText: {
    color: AppColors.PRIMARY_COLOR,
    fontWeight: "700",
    marginLeft: 10,
  },
});
