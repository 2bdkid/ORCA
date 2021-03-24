import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OBSWebSocketApp from './OBSWebsocketApp';

const AppWrapper = () => {
  return (
    <NavigationContainer>
      <OBSWebSocketApp />
    </NavigationContainer>
  );
};

export default AppWrapper;