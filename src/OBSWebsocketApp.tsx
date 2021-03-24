import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useOBSWebSocket from './useOBSWebSocket';

const uri = {
  address: '192.168.1.18:4444',
  password: "password"
};

const OBSWebSocketApp = () => {
  const { 
    obs,
    sceneList,
    currentScene,
    isCurrentlyStreaming,
    setScene,
  } = useOBSWebSocket(uri);

  const toggleStream = async () => {
    await obs
      .send('StartStopStreaming')
      .catch(e => console.log(e));
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
  sceneList: Readonly<{ name: string }[]>,
  currentScene: Readonly<string>,
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