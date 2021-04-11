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

import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress, changeAddress, changePassword } from '../../features/OBSWebSocket/OBSWebSocketConnectionSlice';

export default () => {
  const dispatch = useDispatch();
  const reduxAddress = useSelector(selectAddress);
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const addressInput = useRef(null);  // TODO: fix types
  const passwordInput = useRef(null); // TODO: fix types

  const onChangePress = () => {
    dispatch(changeAddress(address));
    dispatch(changePassword(password));
    addressInput.current.blur();
    passwordInput.current.blur();
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder={reduxAddress}
        onChangeText={value => setAddress(value)}
        leftIcon={{ type: 'ionicon', name: 'home-outline' }}
        ref={addressInput}
      />
      <Input
        onChangeText={value => setPassword(value)}
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
        placeholder='OBS WebSocket password'
        ref={passwordInput}
        secureTextEntry
      />
      <Button
        title='Change'
        onPress={onChangePress}
        containerStyle={styles.changeButton}
        raised
      />
    </View>
  );
};

const styles = StyleSheet.create({
  changeButton: {
    width: 100,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center'
  }
});