import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';

import { CommunityScreen } from '../screens/Community';
import { ProfileScreen } from '../screens/Profile';
import { TreatmentPlanScreen } from '../screens';  // 修改这行
import { ChatScreen } from '../screens/Chat';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 8,
          paddingBottom: 0,
          marginTop: -4,
          position: 'relative',
          top: -2
        },
        tabBarStyle: {
          height: 50,
          paddingTop: 5,
          paddingBottom: 5
        },
        tabBarItemStyle: {
          borderRightWidth: 0.5,
          borderRightColor: '#E0E0E0'
        },
        tabBarActiveTintColor: '#333333', // 保持激活时的文字颜色
        tabBarInactiveTintColor: '#333333', // 保持未激活时的文字颜色
        tabBarActiveBackgroundColor: '#D5E8FF', // 改成浅蓝色背景
        tabBarInactiveBackgroundColor: '#FFFFFF', // 未激活时的背景色
      })}>
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: '医疗助手'
        }}
      />
      <Tab.Screen 
        name="TreatmentPlan" 
        component={TreatmentPlanScreen}
        options={{
          title: '治疗计划'
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{
          title: '社区'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarItemStyle: {
            borderRightWidth: 0  // 最后一个选项不需要右边框
          }
        }}
      />
    </Tab.Navigator>
  );
}