import React, { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';

interface TTSPageAdapterProps {
  /**
   * 页面名称，用于屏幕切换播报
   */
  screenName: string;
  
  /**
   * 页面主要内容，用于内容朗读功能
   */
  screenContent?: string;
  
  /**
   * 重要提示消息，用于自动播报功能
   */
  importantMessage?: string;
}

/**
 * TTSPageAdapter 组件用于整合页面内容和TTS功能
 * 根据用户设置决定是否朗读页面内容或自动播报重要提示
 */
export const TTSPageAdapter: React.FC<TTSPageAdapterProps> = ({
  screenName,
  screenContent,
  importantMessage
}) => {
  const { speak, stop, settings } = useTTS();

  // 处理重要提示自动播报
  useEffect(() => {
    if (importantMessage && settings.enabled && settings.autoPlay) {
      speak(importantMessage);
    }
  }, [importantMessage, settings.enabled, settings.autoPlay, speak]);

  // 处理屏幕内容朗读
  useEffect(() => {
    if (screenContent && settings.enabled && settings.readScreen) {
      // 使用延迟以确保UI渲染完成
      const timeoutId = setTimeout(() => {
        speak(`${screenName}页面: ${screenContent}`);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [screenContent, screenName, settings.enabled, settings.readScreen, speak]);

  // 此组件不渲染任何内容，仅处理TTS逻辑
  return null;
};

export default TTSPageAdapter;
