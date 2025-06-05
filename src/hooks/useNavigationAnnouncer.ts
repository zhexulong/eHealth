import { useCallback, useEffect, useRef } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useTTS } from './useTTS';

/**
 * 用于页面导航时的语音播报
 * 监听页面切换，并根据设置决定是否播报当前页面名称
 */
export const useNavigationAnnouncer = () => {
  const navigation = useNavigation();
  const { speak, stop, settings } = useTTS();
  const prevRouteRef = useRef<string | null>(null);
  const initialMountRef = useRef(true);
  
  // 获取当前路由名称
  const currentRoute = useNavigationState(state => {
    if (state?.routes?.length) {
      const route = state.routes[state.index];
      return route.name;
    }
    return null;
  });
  
  // 根据路由名获取对应的中文名称
  const getPageNameInChinese = useCallback((routeName: string): string => {
    switch (routeName) {
      case 'Chat':
        return '对话';
      case 'TreatmentPlan':
        return '治疗计划';
      case 'Community':
        return '协同提醒';
      case 'Profile':
        return '我的';
      case 'Settings':
        return '设置';
      case 'TTSSettings':
        return '语音设置';
      default:
        return routeName;
    }
  }, []);
  
  // 处理页面变化
  useEffect(() => {
    // 不论是否启用播报功能，页面切换时都停止当前朗读，避免干扰
    if (currentRoute && currentRoute !== prevRouteRef.current) {
      stop();
    }
    
    // 首次挂载时不播报，只记录初始路由
    if (initialMountRef.current) {
      initialMountRef.current = false;
      if (currentRoute) {
        prevRouteRef.current = currentRoute;
      }
      return;
    }

    // 只有当前路由存在 且 与上一个路由不同 且 功能已启用时才播报
    if (
      currentRoute && 
      currentRoute !== prevRouteRef.current && 
      settings.enabled && 
      settings.announceScreen
    ) {
      const pageNameInChinese = getPageNameInChinese(currentRoute);
      // 延迟一小段时间，确保页面过渡动画完成
      setTimeout(() => {
        speak(`当前页面：${pageNameInChinese}`);
      }, 300);
      prevRouteRef.current = currentRoute;
    } else if (currentRoute) {
      prevRouteRef.current = currentRoute;
    }
  }, [currentRoute, settings.announceScreen, settings.enabled, speak, stop, getPageNameInChinese]);
  
  return {
    currentRouteName: currentRoute,
    currentPageNameInChinese: currentRoute ? getPageNameInChinese(currentRoute) : '',
    announceCurrentPage: () => {
      if (currentRoute && settings.enabled) {
        stop(); // 先停止当前播放
        const pageNameInChinese = getPageNameInChinese(currentRoute);
        speak(`当前页面：${pageNameInChinese}`);
      }
    }
  };
};
