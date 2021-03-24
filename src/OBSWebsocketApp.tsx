import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OBSWebSocket from 'obs-websocket-js';
import useOBSWebSocket from './useOBSWebSocket';

const uri = {
  address: '192.168.1.18:4444',
  password: "password"
};

const OBSWebSocketApp = () => {
  const [sceneList, setSceneList] = useState<OBSWebSocket.Scene[]>([]);
  const [currentScene, setCurrentScene] = useState('');
  const [isCurrentlyStreaming, setIsCurrentlyStreaming] = useState(false);
  const { obs } = useOBSWebSocket();

  const getCurrentScene = async () => {
    return obs.send('GetCurrentScene')
      .then(data => setCurrentScene(data.name));
  };

  // connect to obs websocket and get current scene
  useEffect(() => {
    (async () => {
      await obs.connect(uri)
        .then(getCurrentScene)
        .catch(e => console.log(e));
    })();
    return () => obs.disconnect();
  }, []);

  // set up event callbacks
  useEffect(() => {
    // update currentScene
    obs.on('SwitchScenes', ({ 'scene-name': scene }) =>
      setCurrentScene(scene)
    );
    obs.on('StreamStarted', () => {
      setIsCurrentlyStreaming(true);
    });
    obs.on('StreamStopped', () => {
      setIsCurrentlyStreaming(false);
    });
  }, []);

  const getSceneList = async () => {
    await obs
      .send('GetSceneList')
      .then(data => setSceneList(data.scenes))
      .catch(e => console.log(e));
  };

  const toggleStream = async () => {
    await obs
      .send('StartStopStreaming')
      .catch(e => console.log(e));
  };

  // update scene list continuously
  useEffect(() => {
    getSceneList();
  });

  const setScene = (sceneName: string) => {
    (async () => obs.send('SetCurrentScene', { 'scene-name': sceneName })
      .then(() => setCurrentScene(sceneName))
      .catch(e => console.log(e)))();
  };

  return (
    <SafeAreaProvider>
      <SceneSelectHeader />
      <View style={styles.container}>
        <SceneSelect
          setScene={setScene}
          sceneList={sceneList}
          currentScene={currentScene}
        />
        <StartStopStreamingButton
          onPress={toggleStream}
          isStreaming={isCurrentlyStreaming}
        />
      </View>
    </SafeAreaProvider>
  );
}

interface SceneSelectProps {
  setScene: (sceneName: string) => void,
  sceneList: { name: string }[],
  currentScene: string,
}

const SceneSelectHeader = () => {
  return (
    <Header
      centerComponent={{ text: "Select Scene", style: styles.headingText }}
      backgroundColor="white"
    />
  );
};

const SceneSelect = (props: SceneSelectProps) => {
  const setScene = props.setScene;
  const sceneList = props.sceneList;
  const currentScene = props.currentScene;

  return (
    <View>
      <ScrollView>
        {sceneList.map(scene =>
          <Button
            onPress={() => setScene(scene.name)}
            title={scene.name}
            key={scene.name}
            containerStyle={styles.buttonPadding}
            buttonStyle={scene.name == currentScene ? styles.selectedButton : styles.unselectedButton}
          />)}
      </ScrollView>
    </View>
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
      title={isStreaming ? "Stop Stream" : "Start Stream"}
    />
  );
};

const styles = StyleSheet.create({
  unselectedButton: {
    backgroundColor: "#009eed",
  },
  selectedButton: {
    backgroundColor: "#0274ad",
  },
  buttonPadding: {
    paddingBottom: 10
  },
  headingText: {
    fontSize: 25,
  },
  container: {
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexDirection: "row-reverse",
  }
});

export default OBSWebSocketApp;