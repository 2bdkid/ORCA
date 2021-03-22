import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, Button } from 'react-native';
import OBSWebSocket from 'obs-websocket-js';

const uri = {
  address: '192.168.1.18:4444',
  password: "password"
}

const OBSWebSocketApp = () => {
  const [sceneList, setSceneList] = useState<OBSWebSocket.Scene[]>([]);
  const [connected, setConnected] = useState(false);
  const obs = useRef(new OBSWebSocket);

  // connect to obs websocket
  useEffect(() => {
    (async () => {
      await obs.current
        .connect(uri)
        .then(() => setConnected(true))
        .catch(e => console.log(e));
    })();
    return () => obs.current.disconnect();
  }, []);

  const refreshSceneList = async () => {
    await obs.current
      .send('GetSceneList')
      .then(data => setSceneList(data.scenes))
      .catch(e => console.log(e));
  };

  // initial scene list
  useEffect(() => {
    refreshSceneList();
  }, [connected]);

  // update scene list continuously
  useEffect(() => {
    refreshSceneList();
  });

  const createSetSceneSelectCallback = (sceneName: string) => {
    return () => {
      (async () => obs.current
        .send('SetCurrentScene', {'scene-name': sceneName})
        .catch(e => console.log(e)))();
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Available Scenes</Text>
      <ScrollView>
      { sceneList.map(scene => <Button onPress={createSetSceneSelectCallback(scene.name)} 
                                       title={scene.name} 
                                       key={scene.name} />) }
      </ScrollView>
    </SafeAreaView>
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