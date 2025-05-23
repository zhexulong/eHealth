import React from 'react';
import { View } from 'react-native';
import { useNavigationAnnouncer } from '@/hooks/useNavigationAnnouncer';
import { useTTS } from '@/hooks/useTTS';

interface NavigationAnnouncerWrapperProps {
  children: React.ReactNode;
}

/**
 * 导航播报包装组件
 * 用于正确位置使用useNavigationAnnouncer hook
 */
export const NavigationAnnouncerWrapper: React.FC<NavigationAnnouncerWrapperProps> = ({ children }) => {  // 在NavigationContainer内部使用导航播报hook
  useTTS(); // 确保TTS上下文可用
    // 使用导航播报hook，它会监听页面变化并处理播报
  useNavigationAnnouncer();
  
  return (
    <>{children}</>
  );
};
