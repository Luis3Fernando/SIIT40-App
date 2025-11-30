import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "./types";
import { AppColors } from "@theme/Colors";
import { Ionicons } from "@expo/vector-icons";
import ConnectionScreen from "@screens/ConnectionScreen";
import DashboardScreen from "@screens/DashboardScreen";
import ControlScreen from "@screens/ControlScreen";
import HistoryScreen from "@screens/HistoryScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help";
          if (route.name === "Dashboard") {
            iconName = focused ? "speedometer" : "speedometer-outline";
          } else if (route.name === "Control") {
            iconName = focused ? "water" : "water-outline";
          } else if (route.name === "Data") {
            iconName = focused ? "cloud" : "cloud-outline";
          } else if (route.name === "Connectivity") {
            iconName = focused ? "wifi" : "wifi-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: AppColors.PRIMARY_COLOR,
        tabBarInactiveTintColor: AppColors.TEXT_GRAY,
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 5,
          height: 60,
          backgroundColor: AppColors.WHITE,
          borderTopWidth: 0,
          shadowColor: AppColors.BLACK,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Monitoreo" }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{ title: "Control" }}
      />
      <Tab.Screen
        name="Data"
        component={HistoryScreen}
        options={{ title: "Nube" }}
      />
      <Tab.Screen
        name="Connectivity"
        component={ConnectionScreen}
        options={{ title: "Conexión" }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
