import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OBSWebSocket from 'obs-websocket-js';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { OBSWebSocketContext } from '../useOBSWebSocket';
import { Picker } from '@react-native-picker/picker';

export const SceneSelectContext = React.createContext({
  sceneList: [] as Readonly<OBSWebSocket.Scene[]>,
  currentScene: '',
  setCurrentScene: (_: string) => { },
  currentSceneCollection: '' as Readonly<string>,
  sceneCollectionList: [] as Readonly<string[]>,
  setCurrentSceneCollection: (scene: string) => {},
});

const SceneSelect = () => {
  const {
    sceneList,
    currentScene,
    setCurrentScene,
    currentSceneCollection,
    sceneCollectionList,
    setCurrentSceneCollection,
  } = useContext(SceneSelectContext);

  const {
    connected,
    reconnect
  } = useContext(OBSWebSocketContext);

  return (
    <SafeAreaView>
      <WarnOnStreamDisconnect reconnect={reconnect} connected={connected}>
        <View style={styles.sceneSelectContainer}>
          <Picker 
            mode='dropdown'
            selectedValue={currentSceneCollection}
            onValueChange={collection => setCurrentSceneCollection(collection)}
          >
            { sceneCollectionList.map(collection => <Picker.Item key={collection} label={collection} value={collection} />) }
          </Picker>

          <ScrollView contentContainerStyle={styles.sceneSelectListContainer}>
            {sceneList.map(scene =>
              <Button
                onPress={() => setCurrentScene(scene.name)}
                title={scene.name}
                key={scene.name}
                containerStyle={styles.buttonContainer}
                buttonStyle={scene.name == currentScene ? styles.selectedButton : styles.unselectedButton}
                raised
              />)}
          </ScrollView>
        </View>
      </WarnOnStreamDisconnect>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  unselectedButton: {
    backgroundColor: '#009eed',
  },
  selectedButton: {
    backgroundColor: '#0274ad',
  },
  buttonContainer: {
    marginTop: 10,
    minWidth: 75,
  },
  sceneSelectContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sceneSelectListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default SceneSelect;