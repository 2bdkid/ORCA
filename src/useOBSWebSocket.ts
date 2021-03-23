import { useRef } from 'react';
import OBSWebSocket from 'obs-websocket-js';

interface useOBSWebSocketReturnValue {
    obs: OBSWebSocket
};

const useOBSWebSocket = (): useOBSWebSocketReturnValue => {
    const obs = useRef(new OBSWebSocket);
    return { obs: obs.current };
};

export default useOBSWebSocket;