import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/app/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { ConnectionManager } from '@components/ConnectionManager';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ConnectionManager />
        <NavigationContainer>
          <AppNavigator />
          <StatusBar barStyle="light-content"/> 
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}