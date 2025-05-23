import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { BottomNavigation, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommunityScreen } from '../screens/Community';
import { ProfileScreen } from '../screens/Profile';
import { TreatmentPlanScreen } from '../screens';
import { ChatScreen } from '../screens/Chat';
import { SettingsScreen } from '../screens/Settings';
import { CustomHeader } from '../components/molecules/CustomHeader';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // 启用 Header
        headerTitle: ({ children }) => {
          // 准备不同页面的朗读内容
          let screenText = "";
          switch (route.name) {
            case 'Chat':
              screenText = "对话页面，您可以与AI医生交流您的健康问题";
              break;
            case 'TreatmentPlan':
              screenText = "治疗计划页面，查看您的用药提醒和治疗进度";
              break;
            case 'Community':
              screenText = "社区页面，您可以在这里参与健康讨论和获取支持";
              break;
            case 'Profile':
              screenText = "个人信息页面，查看您的健康记录和成就";
              break;
            case 'Settings':
              screenText = "设置页面，您可以在这里调整应用偏好";
              break;
            default:
              screenText = `${children}页面`;
          }
          return (
            <CustomHeader title={children?.toString() || ""} screenText={screenText} />
          );
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Chat':
              iconName = 'chat-processing';
              break;
            case 'TreatmentPlan':
              iconName = 'calendar-check';
              break;
            case 'Community':
              iconName = 'account-group';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }}
          renderIcon={({ route, focused, color }) => {
            let iconName;
            switch (route.name) {
              case 'Chat':
                iconName = 'chat-processing';
                break;
              case 'TreatmentPlan':
                iconName = 'calendar-check';
                break;
              case 'Community':
                iconName = 'account-group';
                break;
              case 'Profile':
                iconName = 'account';
                break;
              case 'Settings':
                iconName = 'cog';
                break;
              default:
                iconName = 'help';
            }
            return <Icon name={iconName} size={24} color={color} />;
          }}
          getLabelText={({ route }) => {
            switch (route.name) {
              case 'Chat':
                return '对话';
              case 'TreatmentPlan':
                return '治疗计划';
              case 'Community':
                return '社区';
              case 'Profile':
                return '我的';
              case 'Settings':
                return '设置';
              default:
                return route.name;
            }
          }}
        />
      )}>
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: '对话'
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
          title: '我的'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: '设置'
        }}
      />
    </Tab.Navigator>
  );
}