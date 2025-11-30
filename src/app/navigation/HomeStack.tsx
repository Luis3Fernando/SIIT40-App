import React from 'react';
// Debes instalar esta dependencia: npm install @react-navigation/stack
import { createStackNavigator } from '@react-navigation/stack'; 
import { HomeStackParamList } from './types';
import DashboardScreen from '@screens/DashboardScreen';
import StatsScreen from '@screens/StatsScreen';
import { AppColors } from '@theme/Colors';

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
          fontWeight: '700',
          color: AppColors.DARK_COLOR,
        },
        headerTintColor: AppColors.PRIMARY_COLOR,
      }}
    >
      <Stack.Screen 
        name="HomeDashboard" 
        component={DashboardScreen} 
        options={{ title: 'Monitoreo', headerShown: false }} 
      />
      
      {/* Registramos la pantalla Stats, lista para recibir parámetros */}
      <Stack.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={({ route }) => ({
          title: route.params.metricName, 
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;