import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export const StartStopStreamingButtonContext = React.createContext({
  isCurrentlyStreaming: false,
  onPress: () => { },
});

const StartStopStreamingButton = () => {
  return (
    <StartStopStreamingButtonContext.Consumer>
      { ({ isCurrentlyStreaming, onPress }) => {
        return (
          <View>
            <Button
              onPress={onPress}
              title={isCurrentlyStreaming ? 'Stop Stream' : 'Start Stream'}
              containerStyle={styles.startStopStreamingButton}
            />
          </View>
        );
      }}
    </StartStopStreamingButtonContext.Consumer>
  );
};

const styles = StyleSheet.create({
  startStopStreamingButton: {
    width: '50%'
  },
});

export default StartStopStreamingButton;