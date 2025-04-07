import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabNavigator } from './MainTabNavigator';
import Startup from '@/screens/Startup/Startup';
import { Paths } from './paths';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function ApplicationNavigator() {
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
