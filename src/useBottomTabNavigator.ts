import { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const useBottomTabNavigator = () => {
  const Tab = useRef(createBottomTabNavigator());
  return Tab.current;
};

export default useBottomTabNavigator;