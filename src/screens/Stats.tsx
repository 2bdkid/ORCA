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
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { OBSWebSocketContext } from '../useOBSWebSocket';
import OBSWebSocketConnectionForm from '../features/OBSWebSocket/OBSWebSocketConnectionForm';

export const StatsContext = React.createContext({
  stats: {
    fps: 0.0,
    'render-total-frames': 0,
    'render-missed-frames': 0,
    'output-total-frames': 0,
    'output-skipped-frames': 0,
    'average-frame-time': 0,
    'cpu-usage': 0,
    'memory-usage': 0,
    'free-disk-space': 0,
  },
});

const Stats = () => {
  const {
    stats,
  } = useContext(StatsContext);

  const {
    reconnect,
    isCurrentlyStreaming,
    connected
  } = useContext(OBSWebSocketContext);

  return (
    <SafeAreaView>
      <OBSWebSocketConnectionForm />
      <WarnOnStreamDisconnect reconnect={reconnect} connected={connected}>
        <View style={styles.container}>
          {isCurrentlyStreaming ?
            <>
              <Text>Render Total Frames: {stats['render-total-frames']}</Text>
              <Text>Render Missed Frames: {stats['render-missed-frames']}</Text>
              <Text>Output Total Frames: {stats['output-total-frames']}</Text>
              <Text>Output Skipped Frames: {stats['output-skipped-frames']}</Text>
              <Text>Average Frame Time: {stats['average-frame-time']}</Text>
              <Text>CPU Usage: {stats['cpu-usage']}</Text>
              <Text>Memory Usage: {stats['memory-usage']}</Text>
              <Text>Free Disk Space: {stats['free-disk-space']}</Text>
            </>
            : <Text>Not currently streaming</Text>
          }
        </View>
      </WarnOnStreamDisconnect>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 10,
  }
});

export default Stats;