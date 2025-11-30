import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "./types";
import { AppColors } from "@theme/Colors";
import { Ionicons } from "@expo/vector-icons";
import ConnectionScreen from "@screens/ConnectionScreen";
import ControlScreen from "@screens/ControlScreen";
import SyncScreen from "@screens/SyncScreen";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  const { PRIMARY_COLOR, TEXT_GRAY, WHITE, BLACK } = AppColors;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help";
          if (route.name === "Home") {
            iconName = focused ? "speedometer" : "speedometer-outline";
          } else if (route.name === "Control") {
            iconName = focused ? "water" : "water-outline";
          } else if (route.name === "Data") {
            iconName = focused ? "cloud-upload" : "cloud-upload-outline";
          } else if (route.name === "Connectivity") {
            iconName = focused ? "wifi" : "wifi-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: AppColors.TEXT_GRAY,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Monitoreo" }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{ title: "Control" }}
      />
      <Tab.Screen
        name="Data"
        component={SyncScreen}
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
