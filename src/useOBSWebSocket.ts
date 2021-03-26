import { useState, useRef, useEffect } from 'react';
import OBSWebSocket from 'obs-websocket-js';
import useInterval from 'react-useinterval';

interface useOBSWebSocketReturnValue {
  obs: OBSWebSocket,
  readonly sceneList: OBSWebSocket.Scene[],
  readonly currentScene: string,
  setCurrentScene: (scene: string) => void,
  readonly isCurrentlyStreaming: boolean,
  readonly stats: OBSWebSocket.OBSStats,
};

interface SocketURI {
  address: string,
  password: string,
}

const useOBSWebSocket = (uri: SocketURI): useOBSWebSocketReturnValue => {
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
    (async () => await obs.current
      .send('GetStats')
      .then(({ stats }) => setStats(stats))
      .catch(e => console.log(e)))();
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

  // connect to obs websocket and get state
  useEffect(() => {
    (async () => {
      await obs.current
        .connect(uri)
        .then(getIsCurrentlyStreaming)
        .then(getCurrentScene)
        .then(getSceneList)
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
    obs: obs.current,
    sceneList: sceneList,
    currentScene: currentScene,
    isCurrentlyStreaming: isCurrentlyStreaming,
    setCurrentScene: setCurrentSceneInSync,
    stats: stats,
  };
};

export default useOBSWebSocket;