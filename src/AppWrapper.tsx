import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OBSWebSocketApp from './OBSWebsocketApp';

const AppWrapper = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
          <OBSWebSocketApp />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppWrapper;