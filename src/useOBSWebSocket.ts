import { useState, useRef, useEffect } from 'react';
import OBSWebSocket from 'obs-websocket-js';

interface useOBSWebSocketReturnValue {
  obs: OBSWebSocket,
  sceneList: OBSWebSocket.Scene[],
  currentScene: string,
  setScene: (scene: string) => void,
  isCurrentlyStreaming: boolean,
};

interface SocketURI {
  address: string,
  password: string,
}

const useOBSWebSocket = (uri: SocketURI): useOBSWebSocketReturnValue => {
  const obs = useRef(new OBSWebSocket);
  const [sceneList, setSceneList] = useState<OBSWebSocket.Scene[]>([]);
  const [currentScene, setCurrentScene] = useState('');
  const [isCurrentlyStreaming, setIsCurrentlyStreaming] = useState(false);

  const getCurrentScene = async () => {
    return obs.current
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
    obs.current.on('StreamStarted', () => {
      setIsCurrentlyStreaming(true);
    });
    obs.current.on('StreamStopped', () => {
      setIsCurrentlyStreaming(false);
    });
  }, []);

  const setScene = (sceneName: string) => {
    (async () => obs.current
      .send('SetCurrentScene', { 'scene-name': sceneName })
      .then(() => setCurrentScene(sceneName))
      .catch(e => console.log(e)))();
  };

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

  return {
    obs: obs.current,
    sceneList: sceneList,
    currentScene: currentScene,
    isCurrentlyStreaming: isCurrentlyStreaming,
    setScene: setScene,
  };
};

export default useOBSWebSocket;