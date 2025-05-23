import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabNavigator } from './MainTabNavigator';
import Startup from '@/screens/Startup/Startup';
import { TTSSettingsScreen } from '@/screens/Settings/TTSSettingsScreen';
import { Paths } from './paths';
import type { RootStackParamList } from './types';
// 导入NavigationAnnouncerWrapper组件，替代直接使用hook
import { NavigationAnnouncerWrapper } from '@/components/molecules/NavigationAnnouncerWrapper';

const Stack = createStackNavigator<RootStackParamList>();

export function ApplicationNavigator() {
  return (
    <NavigationContainer>
      {/* 在NavigationContainer内部使用NavigationAnnouncerWrapper组件 */}
      <NavigationAnnouncerWrapper>
        <Stack.Navigator 
          screenOptions={{
            headerShown: true,
          }}
          initialRouteName={Paths.Startup}
        >
          <Stack.Screen 
            name={Paths.Main}
            component={MainTabNavigator}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name={Paths.TTSSettings}
            component={TTSSettingsScreen}
            options={{
              title: '语音设置'
            }}
          />
        </Stack.Navigator>
      </NavigationAnnouncerWrapper>
    </NavigationContainer>
  );
}
