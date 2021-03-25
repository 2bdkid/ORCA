import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OBSWebSocket from 'obs-websocket-js';
import useBottomTabNavigator from './useBottomTabNavigator';
import useOBSWebSocket from './useOBSWebSocket';

const uri = {
  address: '192.168.1.18:4444',
  password: 'password'
};

const SceneSelectContext = React.createContext({
  sceneList: [] as Readonly<OBSWebSocket.Scene[]>,
  currentScene: '',
  setCurrentScene: (_: string) => { },
});

const StartStopStreamingButtonContext = React.createContext({
  isCurrentlyStreaming: false,
  onPress: () => { },
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

  const sceneSelectContext = {
    sceneList: sceneList,
    currentScene: currentScene,
    setCurrentScene: setCurrentScene,
  };

  const startStopStreamingButtonContext = {
    isCurrentlyStreaming: isCurrentlyStreaming,
    onPress: toggleStream,
  }

  return (
    <StartStopStreamingButtonContext.Provider value={startStopStreamingButtonContext}>
      <SceneSelectContext.Provider value={sceneSelectContext}>
        <Tab.Navigator
          initialRouteName='Scene Select'
          tabBarOptions={{ 'showLabel': false }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const iconName = (route.name == 'Scene Select') ? 'home-outline' : 'cloud-upload-outline';
              return <Ionicons name={iconName} color={color} size={size} />;
            }
          })}
        >
          <Tab.Screen
            name='Scene Select'
            component={SceneSelect}
          />
          <Tab.Screen
            name='Start Stop Stream Button'
            component={StartStopStreamingButton}
          />
        </Tab.Navigator>
      </SceneSelectContext.Provider>
    </StartStopStreamingButtonContext.Provider>
  );
}

const SceneSelect = () => {
  return (
    <SceneSelectContext.Consumer>
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
    </SceneSelectContext.Consumer>
  );
}

const StartStopStreamingButton = () => {
  return (
    <StartStopStreamingButtonContext.Consumer>
      { ({ isCurrentlyStreaming, onPress }) => {
        return (
          <View style={styles.startStopStreamingButtonContainer}>
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
    marginTop: 10
  },
  startStopStreamingButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startStopStreamingButton: {
    width: '50%'
  },
});

export default OBSWebSocketApp;