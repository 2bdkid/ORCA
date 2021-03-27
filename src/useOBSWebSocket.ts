import React, {useState, useRef, useEffect } from 'react';
import OBSWebSocket from 'obs-websocket-js';
import useInterval from 'react-useinterval';

interface useOBSWebSocketReturnValue {
  obs: OBSWebSocket,
  connected: boolean,
  readonly sceneList: OBSWebSocket.Scene[],
  readonly currentScene: string,
  setCurrentScene: (scene: string) => void,
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
      .then(({ streaming }) => setIsCurrentlyStreaming(streaming))
  }

  const setConnectedTrue = async () => {
    setConnected(true);
  };

  const connect = async () => {
    return await obs.current
      .connect(uri)
      .then(setConnectedTrue)
      .then(getIsCurrentlyStreaming)
      .then(getCurrentScene)
      .then(getSceneList)
  };

  // connect to obs websocket and get state
  useEffect(() => {
    (async () => await connect().catch(e => console.log(e)))();
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
    obs.current.on('ScenesChanged', ({ scenes }) => {
      setSceneList(scenes);
    });
  }, []);

  const setCurrentSceneInSync = (sceneName: string) => {
    (async () => obs.current
      .send('SetCurrentScene', { 'scene-name': sceneName })
      .then(() => setCurrentScene(sceneName))
      .catch(e => console.log(e)))();
  };

  return {
    connected: connected,
    obs: obs.current,
    sceneList: sceneList,
    currentScene: currentScene,
    isCurrentlyStreaming: isCurrentlyStreaming,
    setCurrentScene: setCurrentSceneInSync,
    stats: stats,
    reconnect: connect,
  };
};

export default useOBSWebSocket;