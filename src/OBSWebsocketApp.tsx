import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import OBSWebSocket from 'obs-websocket-js';
import useBottomTabNavigator from './useBottomTabNavigator';
import useOBSWebSocket from './useOBSWebSocket';

const uri = {
  address: '192.168.1.18:4444',
  password: 'password'
};

const OBSContext = React.createContext({
  sceneList: [] as Readonly<OBSWebSocket.Scene[]>,
  currentScene: '' as Readonly<String>,
  isCurrentlyStreaming: false as Readonly<Boolean>,
  setCurrentScene: (_: string) => { },
});

const OBSWebSocketApp = () => {
  const Tab = useBottomTabNavigator();

  const {
    obs,
    sceneList,
    currentScene,
    isCurrentlyStreaming,
    setCurrentScene,
  } = useOBSWebSocket(uri);

  const toggleStream = async () => {
    await obs
      .send('StartStopStreaming')
      .catch(e => console.log(e));
  };

  const context = {
    sceneList: sceneList,
    currentScene: currentScene,
    isCurrentlyStreaming: isCurrentlyStreaming,
    setCurrentScene: setCurrentScene,
  };

  return (
    <OBSContext.Provider value={context}>
      <Tab.Navigator>
        <Tab.Screen name='Scene Select' component={SceneSelect} />
      </Tab.Navigator>
    </OBSContext.Provider>
  );
}

const SceneSelect = () => {
  return (
    <OBSContext.Consumer>
      { ({ sceneList, currentScene, setCurrentScene }) => {
        return (
          <View>
            <ScrollView contentContainerStyle={styles.sceneSelectContainer}>
              {sceneList.map(scene =>
                <Button
                  onPress={() => setCurrentScene(scene.name)}
                  title={scene.name}
                  key={scene.name}
                  containerStyle={styles.buttonPadding}
                  buttonStyle={scene.name == currentScene ? styles.selectedButton : styles.unselectedButton}
                />)}
            </ScrollView>
          </View>
        );
      }}
    </OBSContext.Consumer>
  );
}

interface StartStopStreamingButtonProps {
  isStreaming: boolean,
  onPress: () => void,
}

const StartStopStreamingButton = (props: StartStopStreamingButtonProps) => {
  const isStreaming = props.isStreaming;
  const onPress = props.onPress;

  return (
    <Button
      onPress={onPress}
      title={isStreaming ? 'Stop Stream' : 'Start Stream'}
    />
  );
};

const styles = StyleSheet.create({
  unselectedButton: {
    backgroundColor: '#009eed',
  },
  selectedButton: {
    backgroundColor: '#0274ad',
  },
  buttonPadding: {
    paddingBottom: 10
  },
  headingText: {
    fontSize: 25,
  },
  sceneSelectContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }
});

export default OBSWebSocketApp;