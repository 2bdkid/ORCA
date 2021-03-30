import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import useOBSWebSocket, { OBSWebSocketContext } from './useOBSWebSocket';
import useBottomTabNavigator from './useBottomTabNavigator';
import SceneSelect, { SceneSelectContext } from './screens/SceneSelect';
import StartStopStreamingButton, { StartStopStreamingButtonContext } from './screens/StartStopStreamingButton';
import Stats, { StatsContext } from './screens/Stats';
import { selectAddress, selectPassword } from './features/OBSWebSocket/OBSWebSocketConnectionSlice';

const OBSWebSocketApp = () => {
  const Tab = useBottomTabNavigator();
  const address = useSelector(selectAddress);
  const password = useSelector(selectPassword);

  const {
    connected,
    obs,
    sceneList,
    currentScene,
    isCurrentlyStreaming,
    setCurrentScene,
    currentSceneCollection,
    setCurrentSceneCollection,
    sceneCollectionList,
    stats,
    reconnect,
  } = useOBSWebSocket({ address, password});

  const obsWebSocketContext = {
    isCurrentlyStreaming: isCurrentlyStreaming,
    reconnect: reconnect,
    connected: connected,
  };

  const toggleStream = () => {
    (async () => await obs
      .send('StartStopStreaming')
      .catch(e => console.log(e)))();
  };

  const sceneSelectContext = {
    sceneList: sceneList,
    currentScene: currentScene,
    setCurrentScene: setCurrentScene,
    currentSceneCollection: currentSceneCollection,
    sceneCollectionList: sceneCollectionList,
    setCurrentSceneCollection: setCurrentSceneCollection,
  };

  const startStopStreamingButtonContext = {
    onPress: toggleStream,
  };

  const statsContext = {
    stats: stats,
  };

  return (
    <OBSWebSocketContext.Provider value={obsWebSocketContext}>
      <StatsContext.Provider value={statsContext}>
        <StartStopStreamingButtonContext.Provider value={startStopStreamingButtonContext}>
          <SceneSelectContext.Provider value={sceneSelectContext}>
            <Tab.Navigator
              initialRouteName='Scene Select'
              tabBarOptions={{ 'showLabel': false }}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  const iconName: { [index: string]: string } = {
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
                options={connected ? {} : { tabBarBadge: '!'}}
              />
            </Tab.Navigator>
          </SceneSelectContext.Provider>
        </StartStopStreamingButtonContext.Provider>
      </StatsContext.Provider>
    </OBSWebSocketContext.Provider>
  );
}

export default OBSWebSocketApp;