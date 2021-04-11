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