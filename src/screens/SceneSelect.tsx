import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OBSWebSocket from 'obs-websocket-js';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';

export const SceneSelectContext = React.createContext({
  sceneList: [] as Readonly<OBSWebSocket.Scene[]>,
  currentScene: '',
  setCurrentScene: (_: string) => { },
});

const SceneSelect = () => {
  return (
    <SafeAreaView>
      <SceneSelectContext.Consumer>
        {({ sceneList, currentScene, setCurrentScene }) => {
          return (
            <View style={styles.sceneSelectContainer}>
              <ScrollView contentContainerStyle={styles.sceneSelectListContainer}>
                {sceneList.map(scene =>
                  <Button
                    onPress={() => setCurrentScene(scene.name)}
                    title={scene.name}
                    key={scene.name}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={scene.name == currentScene ? styles.selectedButton : styles.unselectedButton}
                  />)}
              </ScrollView>
            </View>
          );
        }}
      </SceneSelectContext.Consumer>
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
    paddingBottom: 10,
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
    marginTop: 10,
  }
});

export default SceneSelect;