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
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WarnOnStreamDisconnectProps {
  connected: boolean,
  children: React.ReactElement
  reconnect: () => void,
}

const WarnOnStreamDisconnect = (props: WarnOnStreamDisconnectProps) => {
  const connected = props.connected;
  const children = props.children;
  const reconnect = props.reconnect;
  
  return connected
    ? children
    : (
    <View style={styles.container}>
      <Ionicons style={{ paddingLeft: 15 }} size={200} name='alert-circle-outline' />
      <Text style={{ textAlign: 'center'}}>Not connected to OBS</Text>
      <Button
        containerStyle={styles.buttonContainer}
        title='Retry'
        onPress={reconnect}
        raised
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    height: 40,
    width: 60,
    marginTop: 10
  },
});

export default WarnOnStreamDisconnect;