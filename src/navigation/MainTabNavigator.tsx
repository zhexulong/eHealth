import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommunityScreen } from '../screens/Community';
import { ProfileScreen } from '../screens/Profile';
import { TreatmentPlanScreen } from '../screens';
import { ChatScreen } from '../screens/Chat';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // 启用 Header
        headerTitle: ({ children }) => (
          <Text style={{ color: theme.colors.onSurface, fontSize: 30}}>
            {children}
          </Text>
        ),
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
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }
            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            return options.title || route.name;
          }}
        />
      )}>
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