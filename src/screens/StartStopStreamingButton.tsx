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

import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { OBSWebSocketContext } from '../useOBSWebSocket';

export const StartStopStreamingButtonContext = React.createContext({
  onPress: () => { },
});

const StartStopStreamingButton = () => {
  const {
    onPress,
  } = useContext(StartStopStreamingButtonContext);

  const {
    reconnect,
    connected,
    isCurrentlyStreaming,
  } = useContext(OBSWebSocketContext);

  return (
    <SafeAreaView>
      <WarnOnStreamDisconnect reconnect={reconnect} connected={connected}>
        <View style={styles.container}>
          <Button
            onPress={onPress}
            title={isCurrentlyStreaming ? 'Stop Stream' : 'Start Stream'}
            containerStyle={styles.startStopStreamingButton}
          />
        </View>
      </WarnOnStreamDisconnect>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startStopStreamingButton: {
    width: '50%'
  },
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default StartStopStreamingButton;