import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OBSWebSocket from 'obs-websocket-js';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import WarnOnStreamDisconnect from '../WarnOnStreamDisconnect';
import { StreamContext } from '../useOBSWebSocket';

export const SceneSelectContext = React.createContext({
  sceneList: [] as Readonly<OBSWebSocket.Scene[]>,
  currentScene: '',
  setCurrentScene: (_: string) => { },
});

const SceneSelect = () => {
  const {
    sceneList,
    currentScene,
    setCurrentScene,
  } = useContext(SceneSelectContext);

  const {
    connected,
    reconnect
  } = useContext(StreamContext);

  return (
    <SafeAreaView>
      <WarnOnStreamDisconnect reconnect={reconnect} connected={connected}>
        <View style={styles.sceneSelectContainer}>
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
    alignItems: 'center',
  },
  sceneSelectListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }
});

export default SceneSelect;