import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeStackParamList } from "./types";
import DashboardScreen from "@screens/DashboardScreen";
import StatsScreen from "@screens/StatsScreen";
import { AppColors } from "@theme/Colors";
import HistoryScreen from "@screens/HistoryScreen";
import ConfigScreen from "@screens/ConfigScreen";

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: AppColors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          color: AppColors.PRIMARY_COLOR,
        },
        headerTintColor: AppColors.PRIMARY_COLOR,
      }}
    >
      <Stack.Screen
        name="HomeDashboard"
        component={DashboardScreen}
        options={{ title: "Monitoreo", headerShown: false }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={({ route }) => ({
          title: route.params.metricName,
        })}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Historial" }}
      />
      <Stack.Screen
        name="Config"
        component={ConfigScreen}
        options={{ title: "Configurar especies" }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
