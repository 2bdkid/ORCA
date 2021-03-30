import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OBSWebSocketApp from './OBSWebsocketApp';
import store from './app/store';
import { Provider } from 'react-redux';

const AppWrapper = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <OBSWebSocketApp />
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppWrapper;