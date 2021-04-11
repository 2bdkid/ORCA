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

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import OBSWebSocketConnectionReducer from '../features/OBSWebSocket/OBSWebSocketConnectionSlice';
import { 
  persistReducer, 
  persistStore,  
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'OBSWebSocketConnectionReducer'
  ]
};

const persistedOBSWebSocketConnectionReducer = persistReducer(persistConfig, OBSWebSocketConnectionReducer);

const store = configureStore({
  reducer: {
    OBSWebSocketConnection: persistedOBSWebSocketConnectionReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }
  })
});

export const persistedStore = persistStore(store);
export default store;