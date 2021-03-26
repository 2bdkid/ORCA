import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useOBSWebSocket from './useOBSWebSocket';
import useBottomTabNavigator from './useBottomTabNavigator';
import SceneSelect, { SceneSelectContext } from './screens/SceneSelect';
import StartStopStreamingButton, { StartStopStreamingButtonContext } from './screens/StartStopStreamingButton';
import Stats, { StatsContext } from './screens/Stats';

const uri = {
  address: '192.168.1.18:4444',
  password: 'password'
};

const OBSWebSocketApp = () => {
  const Tab = useBottomTabNavigator();

  const {
    obs,
    sceneList,
    currentScene,
    isCurrentlyStreaming,
    setCurrentScene,
    stats,
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
  };

  const statsContext = {
    isCurrentlyStreaming: isCurrentlyStreaming,
    stats: stats,
  };

  return (
    <StatsContext.Provider value={statsContext}>
      <StartStopStreamingButtonContext.Provider value={startStopStreamingButtonContext}>
        <SceneSelectContext.Provider value={sceneSelectContext}>
          <Tab.Navigator
            initialRouteName='Scene Select'
            tabBarOptions={{ 'showLabel': false }}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                const iconName: { [index:string] : string} = {
                  'Scene Select': 'home-outline',
                  'Start Stop Stream Button': 'cloud-upload-outline',
                  'Stats': 'information-circle-outline',
                }
                return <Ionicons name={iconName[route.name]} color={color} size={size} />;
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
            <Tab.Screen
              name='Stats'
              component={Stats}
            />
          </Tab.Navigator>
        </SceneSelectContext.Provider>
      </StartStopStreamingButtonContext.Provider>
    </StatsContext.Provider>
  );
}

export default OBSWebSocketApp;