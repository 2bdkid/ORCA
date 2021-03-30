import React, { useState, useRef, useEffect } from 'react';
import OBSWebSocket from 'obs-websocket-js';
import useInterval from 'react-useinterval';

interface useOBSWebSocketReturnValue {
  obs: OBSWebSocket,
  connected: boolean,
  readonly sceneList: OBSWebSocket.Scene[],
  readonly currentScene: string,
  setCurrentScene: (scene: string) => void,
  readonly sceneCollectionList: string[],
  readonly currentSceneCollection: string,
  setCurrentSceneCollection: (scene: string) => void,
  readonly isCurrentlyStreaming: boolean,
  readonly stats: OBSWebSocket.OBSStats,
  reconnect: () => void,
};

interface SocketURI {
  address: string,
  password: string,
}

export const OBSWebSocketContext = React.createContext({
  isCurrentlyStreaming: false,
  connected: false,
  reconnect: () => { },
});

const useOBSWebSocket = (uri: SocketURI): useOBSWebSocketReturnValue => {
  const [connected, setConnected] = useState(false);
  const obs = useRef(new OBSWebSocket());
  const [sceneList, setSceneList] = useState<OBSWebSocket.Scene[]>([]);
  const [currentScene, setCurrentScene] = useState('');
  const [isCurrentlyStreaming, setIsCurrentlyStreaming] = useState(false);
  const [currentSceneCollection, setCurrentSceleCollection] = useState('');
  const [sceneCollectionList, setSceneCollectionList] = useState<string[]>([]);
  const [stats, setStats] = useState<OBSWebSocket.OBSStats>({
    fps: 0.0,
    'render-total-frames': 0,
    'render-missed-frames': 0,
    'output-total-frames': 0,
    'output-skipped-frames': 0,
    'average-frame-time': 0,
    'cpu-usage': 0,
    'memory-usage': 0,
    'free-disk-space': 0,
  });

  const getStats = () => {
    (async () => {
      if (connected) {
        await obs.current
          .send('GetStats')
          .then(({ stats }) => setStats(stats))
          .catch(e => console.log(e))
      }
    })();
  };

  useInterval(getStats, 2000);

  const getCurrentScene = async () => {
    return obs.current
      .send('GetCurrentScene')
      .then(data => setCurrentScene(data.name));
  };

  const getSceneList = async () => {
    return obs.current
      .send('GetSceneList')
      .then(data => setSceneList(data.scenes));
  };

  const getIsCurrentlyStreaming = async () => {
    return obs.current
      .send('GetStreamingStatus')
      .then(({ streaming }) => setIsCurrentlyStreaming(streaming));
  }

  const getSceneCollectionList = async () => {
    return obs.current
      .send('ListSceneCollections')
      .then(({ 'scene-collections': collectionList }) => setSceneCollectionList(collectionList.map(({ 'sc-name': collection}) => collection)));
  };

  const getCurrentSceneCollection = async () => {
    return obs.current
      .send('GetCurrentSceneCollection')
      .then(({ 'sc-name': scene }) => setCurrentSceleCollection(scene));
  };

  const setConnectedTrue = () => {
    setConnected(true);
  };

  const connect = async () => {
    return obs.current
      .connect(uri)
      .then(setConnectedTrue)
      .then(getIsCurrentlyStreaming)
      .then(getCurrentScene)
      .then(getCurrentSceneCollection)
      .then(getSceneCollectionList)
      .then(getSceneList)
  };

  // connect to obs websocket and get state
  useEffect(() => {
    (async () => await connect().catch(e => {
      console.log(e);
      setConnected(false);
    }))();
    return () => obs.current.disconnect();
  }, [uri.address, uri.password]);

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
    obs.current.on('ScenesChanged', ({ scenes }) => {
      setSceneList(scenes);
    });
    obs.current.on('Exiting', () => {
      setConnected(false);
    });
    obs.current.on('SceneCollectionChanged', ({ sceneCollection }) => {
      setCurrentSceleCollection(sceneCollection);
    });
    obs.current.on('SceneCollectionListChanged', ({ collectionList }) => {
      setSceneCollectionList(collectionList.map(collection => collection.name));
    });
  }, []);

  const setCurrentSceneInSync = (sceneName: string) => {
    (async () => obs.current
      .send('SetCurrentScene', { 'scene-name': sceneName })
      .then(() => setCurrentScene(sceneName))
      .catch(e => {
        console.log(e);
        setConnected(false);
      }))();
  };

  const setCurrentSceneCollectionInSync = (collectionName: string) => {
    (async () => obs.current
      .send('SetCurrentSceneCollection', { 'sc-name': collectionName })
      .then(() => setCurrentSceleCollection(collectionName))
      .catch(e => {
        console.log(e);
        setConnected(false);
      }))();
  }

  return {
    connected: connected,
    obs: obs.current,
    sceneList: sceneList,
    currentScene: currentScene,
    isCurrentlyStreaming: isCurrentlyStreaming,
    setCurrentScene: setCurrentSceneInSync,
    stats: stats,
    reconnect: connect,
    currentSceneCollection: currentSceneCollection,
    sceneCollectionList: sceneCollectionList,
    setCurrentSceneCollection: setCurrentSceneCollectionInSync,
  };
};

export default useOBSWebSocket;