import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export const StartStopStreamingButtonContext = React.createContext({
  isCurrentlyStreaming: false,
  onPress: () => { },
});

const StartStopStreamingButton = () => {
  const {
    isCurrentlyStreaming,
    onPress,
  } = useContext(StartStopStreamingButtonContext);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Button
          onPress={onPress}
          title={isCurrentlyStreaming ? 'Stop Stream' : 'Start Stream'}
          containerStyle={styles.startStopStreamingButton}
        />
      </View>
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