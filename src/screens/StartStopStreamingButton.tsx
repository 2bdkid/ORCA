import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { StreamContext } from '../useOBSWebSocket';

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
  } = useContext(StreamContext);

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