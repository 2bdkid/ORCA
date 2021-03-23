import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OBSWebSocket from 'obs-websocket-js';

const uri = {
  address: '192.168.1.18:4444',
  password: "password"
};

const OBSWebSocketApp = () => {
  const [sceneList, setSceneList] = useState<OBSWebSocket.Scene[]>([]);
  const [currentScene, setCurrentScene] = useState('');
  const obs = useRef(new OBSWebSocket);

  const getCurrentScene = async () => {
    await obs.current
      .send('GetCurrentScene')
      .then(data => setCurrentScene(data.name));
  };

  // connect to obs websocket and get current scene
  useEffect(() => {
    (async () => {
      await obs.current
        .connect(uri)
        .then(getCurrentScene)
        .catch(e => console.log(e));
    })();
    return () => obs.current.disconnect();
  }, []);

  // set up event callbacks
  useEffect(() => {
    // update currentScene
    obs.current.on('SwitchScenes', ({ 'scene-name': scene }) =>
      setCurrentScene(scene)
    );
  }, []);

  const getSceneList = async () => {
    await obs.current
      .send('GetSceneList')
      .then(data => setSceneList(data.scenes))
      .catch(e => console.log(e));
  };

  // update scene list continuously
  useEffect(() => {
    getSceneList();
  });

  const setScene = (sceneName: string) => {
    (async () => obs.current
      .send('SetCurrentScene', { 'scene-name': sceneName })
      .then(() => setCurrentScene(sceneName))
      .catch(e => console.log(e)))();
  };

  return (
    <SafeAreaProvider>
      <SceneSelectHeader />
      <View style={styles.centered}>
        <SceneSelect
          setScene={setScene}
          sceneList={sceneList}
          currentScene={currentScene}
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

const styles = StyleSheet.create({
  unselectedButton: {
    backgroundColor: "#009eed",
  },
  selectedButton: {
    backgroundColor: "#0274ad",
  },
  buttonPadding: {
    padding: 5
  },
  headingText: {
    fontSize: 25,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OBSWebSocketApp;