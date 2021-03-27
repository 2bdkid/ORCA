import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WarnOnStreamDisconnectProps {
  connected: boolean,
  children: React.ReactElement
}

const WarnOnStreamDisconnect = (props: WarnOnStreamDisconnectProps) => {
  const connected = props.connected;
  const children = props.children;

  return connected
    ? children
    : (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center'}}>Not connected to OBS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }
});

export default WarnOnStreamDisconnect;