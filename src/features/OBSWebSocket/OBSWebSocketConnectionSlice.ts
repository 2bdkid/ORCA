import { createSlice } from '@reduxjs/toolkit';

interface OBSWebSocketConnectionSlice {
  OBSWebSocketConnection: {
    address: string,
    password: string
  }
}

const OBSWebSocketConnectionSlice = createSlice({
  name: 'OBSWebSocketConnection',
  initialState: {
    address: '192.168.1.18:4444',
    password: 'password',
  },
  reducers: {
    changeAddress: (state, action) => {
      state.address = action.payload;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
    }
  }
});

export const selectAddress = (state: OBSWebSocketConnectionSlice) => state.OBSWebSocketConnection.address;
export const selectPassword = (state: OBSWebSocketConnectionSlice) => state.OBSWebSocketConnection.password;

export const { changeAddress, changePassword } = OBSWebSocketConnectionSlice.actions;

export default OBSWebSocketConnectionSlice.reducer;