import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, Button, View } from 'react-native';
import OBSWebSocket from 'obs-websocket-js';

const uri = {
  address: '192.168.1.18:4444',
  password: "password"
}

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
    <SafeAreaView style={styles.container}>
      <SceneSelect
        setScene={setScene}
        sceneList={sceneList}
        currentScene={currentScene}
      />
    </SafeAreaView>
  );
}

interface SceneSelectProps {
  setScene: (sceneName: string) => void,
  sceneList: { name: string }[],
  currentScene: string,
}

const SceneSelect = (props: SceneSelectProps) => {
  const setScene = props.setScene;
  const sceneList = props.sceneList;
  const currentScene = props.currentScene;

  return (
    <View>
      <Text>Available Scenes</Text>
      <ScrollView>
        {sceneList.map(scene =>
          <Button
            onPress={() => setScene(scene.name)}
            title={scene.name}
            key={scene.name}
            color={scene.name == currentScene ? 'red' : 'blue'}
          />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OBSWebSocketApp;