import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { StreamContext } from '../useOBSWebSocket';

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
  } = useContext(StreamContext);

  return (
    <SafeAreaView>
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