import { configureStore } from '@reduxjs/toolkit';
import OBSWebSocketConnectionReducer from '../features/OBSWebSocket/OBSWebSocketConnectionSlice';

export default configureStore({
  reducer: {
    OBSWebSocketConnection: OBSWebSocketConnectionReducer
  }
});