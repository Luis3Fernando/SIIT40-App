import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../components/DashboardScreen';
import ControlScreen from '../components/ControlScreen';
import HistoryScreen from '../components/HistoryScreen';
import ConnectionScreen from '../components/ConnectionScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Control') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Data') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Connectivity') {
            iconName = focused ? 'wifi' : 'wifi-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { paddingVertical: 5, height: 60 } 
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Monitoreo' }} />
      <Tab.Screen name="Control" component={ControlScreen} options={{ title: 'Control Válvulas' }} />
      <Tab.Screen name="Data" component={HistoryScreen} options={{ title: 'Registros' }} />
      <Tab.Screen name="Connectivity" component={ConnectionScreen} options={{ title: 'Conexión' }} />

    </Tab.Navigator>
  );
};

export default AppNavigator;