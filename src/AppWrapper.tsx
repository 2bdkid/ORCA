import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OBSWebSocketApp from './OBSWebsocketApp';
import store from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistedStore } from './app/store';

const AppWrapper = () => {
  return (
    <SafeAreaProvider>
      <PersistGate loading={null} persistor={persistedStore}>
        <NavigationContainer>
          <Provider store={store}>
            <OBSWebSocketApp />
          </Provider>
        </NavigationContainer>
      </PersistGate>
    </SafeAreaProvider>
  );
};

export default AppWrapper;