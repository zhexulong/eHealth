import React, { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTTS } from '@/hooks/useTTS';

interface TTSPageAdapterProps {
  screenName: string;
  screenContent: string;
  importantMessage?: string;
}

/**
 * TTS页面适配器
 * 使任何页面都能支持TTS功能，方便集成到不同屏幕中
 */
const TTSPageAdapter: React.FC<TTSPageAdapterProps> = ({
  screenName,
  screenContent,
  importantMessage
}) => {
  const { speak, stop, settings } = useTTS();
  const isFirstRender = useRef(true);
  const lastScreenName = useRef(screenName);
  const lastImportantMessage = useRef(importantMessage);
  const timerRef = useRef<NodeJS.Timeout>();
  
  // 统一的朗读处理函数
  const handleSpeak = useCallback((text: string) => {
    if (settings.enabled) {
      stop();
      timerRef.current = setTimeout(() => {
        speak(text);
      }, 300);
    }
  }, [settings.enabled, speak, stop]);

  // 处理组件卸载
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      stop();
    };
  }, [stop]);

  // 处理重要消息播报
  useEffect(() => {
    if (!isFirstRender.current && 
        importantMessage && 
        importantMessage !== lastImportantMessage.current && 
        settings.enabled && 
        settings.autoPlay) {
      handleSpeak(importantMessage);
      lastImportantMessage.current = importantMessage;
    }
    isFirstRender.current = false;
  }, [importantMessage, settings.enabled, settings.autoPlay, handleSpeak]);
  
  // 处理页面切换
  useFocusEffect(
    useCallback(() => {
      if (screenName !== lastScreenName.current &&
          settings.enabled && 
          settings.announceScreen) {
        handleSpeak(`进入${screenName}页面`);
        lastScreenName.current = screenName;
      }
    }, [screenName, settings.enabled, settings.announceScreen, handleSpeak])
  );
  // 仅在需要显示单独的TTS按钮时才渲染（例如在特殊页面）
  return null;
};

export { TTSPageAdapter };
