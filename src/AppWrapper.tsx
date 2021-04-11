/* 
Copyright 2021 Brady Dean

This file is part of ORCA.

ORCA is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORCA is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORCA.  If not, see <https://www.gnu.org/licenses/>. 
*/

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