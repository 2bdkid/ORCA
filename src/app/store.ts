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