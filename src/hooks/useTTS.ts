import { useEffect, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import Tts from 'react-native-tts';
import { useHuaweiTTS } from './useHuaweiTTS';
import { useTTSContext } from '@/context/TTSContext';

export interface TTSProgressEvent {
  location: number;
  length: number;
}

// TTS设置接口
export interface TTSSettings {
  enabled: boolean;
  speed: number;
  volume: number;
  language: string;
  autoPlay: boolean; // 是否自动播放重要提示
  announceScreen: boolean; // 是否播报当前屏幕名称
  readScreen: boolean; // 是否朗读屏幕内容
  autoReadAIResponse: boolean; // 是否自动播报AI医生回复
}

// 默认TTS设置
export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  enabled: true,
  speed: 0.5,
  volume: 1.0,
  language: 'zh-CN',
  autoPlay: false, // 默认关闭自动播放
  announceScreen: false, // 默认关闭屏幕播报
  readScreen: false, // 默认关闭屏幕内容朗读
  autoReadAIResponse: false, // 默认关闭自动播报AI医生回复
};

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState<TTSProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [engineReady, setEngineReady] = useState(false);
  
  // 使用全局TTS上下文替代本地状态
  const { settings, updateSettings } = useTTSContext();
  
  // 引入华为TTS hook
  const huaweiTTS = useHuaweiTTS();
  const [useHuaweiEngine, setUseHuaweiEngine] = useState(false);

  // 保存设置
  const saveSettings = useCallback(async (newSettings: Partial<TTSSettings>) => {
    try {
      // 使用全局上下文的updateSettings方法
      const success = await updateSettings(newSettings);
      
      // 如果使用标准TTS且已初始化，同步更新TTS引擎参数
      if (success && isInitialized && !useHuaweiEngine && Tts) {
        try {
          if (newSettings.speed !== undefined && newSettings.speed !== settings.speed) {
            await Tts.setDefaultRate(newSettings.speed);
          }
          if (newSettings.language !== undefined && newSettings.language !== settings.language) {
            await Tts.setDefaultLanguage(newSettings.language);
          }
        } catch (err) {
          console.warn('更新TTS引擎参数失败:', err);
        }
      }
      
      return success;
    } catch (err) {
      console.error('保存TTS设置失败:', err);
      return false;
    }
  }, [settings, isInitialized, useHuaweiEngine, updateSettings]);

  // 切换语音播放启用状态
  const toggleEnabled = useCallback(async () => {
    const newEnabled = !settings.enabled;
    
    // 同步更新华为TTS设置
    if (huaweiTTS.isHuaweiDevice && huaweiTTS.isInitialized) {
      await huaweiTTS.saveSettings({ enabled: newEnabled });
    }
    
    const success = await saveSettings({ enabled: newEnabled });
    return success ? newEnabled : settings.enabled;
  }, [settings, saveSettings, huaweiTTS]);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const initTTS = async () => {
      // 检测是否应该使用华为引擎
      if (huaweiTTS.isHuaweiDevice && huaweiTTS.isInitialized) {
        if (isMounted) {
          setUseHuaweiEngine(true);
          setIsInitialized(true);
          setEngineReady(true);
        }
        return;
      }

      try {
        // 确保 Tts 模块已加载
        if (!Tts) {
          throw new Error('TTS 模块未正确加载');
        }

        // 等待模块初始化
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 500); // 给予模块加载的时间
        });

        try {
          // 尝试初始化 TTS 引擎
          const engines = await Tts.engines();
          if (!engines || engines.length === 0) {
            throw new Error('没有可用的 TTS 引擎');
          }
          if (isMounted) {
            setEngineReady(true);
          }
        } catch (engineErr) {
          console.warn('检查 TTS 引擎失败，将继续尝试初始化:', engineErr);
        }

        // 设置 TTS 参数
        await Tts.setDefaultLanguage(settings.language);
        await Tts.setDefaultRate(settings.speed);
        // Volume is not directly supported in react-native-tts
        
        // 添加事件监听
        Tts.addEventListener('tts-start', () => {
          if (isMounted) {
            setIsSpeaking(true);
            setProgress({ location: 0, length: 1 });
          }
        });
        
        Tts.addEventListener('tts-progress', (event: TTSProgressEvent) => {
          if (isMounted) {
            setProgress(event);
          }
        });
        
        Tts.addEventListener('tts-finish', () => {
          if (isMounted) {
            setIsSpeaking(false);
            setProgress(null);
          }
        });
        
        Tts.addEventListener('tts-cancel', () => {
          if (isMounted) {
            setIsSpeaking(false);
            setProgress(null);
          }
        });
        
        if (isMounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (err: any) {
        console.error('TTS 初始化失败:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : '初始化失败');
          setIsInitialized(false);

          // 如果还有重试次数，则延迟重试
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(initTTS, 1000 * retryCount); // 递增重试延迟
          }
        }
      }
    };

    initTTS();

    return () => {
      isMounted = false;
      // 清理所有事件监听
      if (Tts) {
        try {
          Tts.removeAllListeners('tts-start');
          Tts.removeAllListeners('tts-progress');
          Tts.removeAllListeners('tts-finish');
          Tts.removeAllListeners('tts-cancel');
        } catch (err) {
          console.warn('清理 TTS 监听器失败:', err);
        }
      }
    };
  }, [huaweiTTS.isInitialized, huaweiTTS.isHuaweiDevice, settings]);

  const speak = useCallback(async (text: string) => {
    // 如果TTS功能被禁用，直接返回
    if (!settings.enabled) {
      return;
    }

    // 使用华为TTS引擎
    if (useHuaweiEngine) {
      return huaweiTTS.speak(text);
    }

    // 使用标准TTS引擎
    if (!Tts) {
      console.error('TTS 模块未加载');
      return;
    }

    if (!isInitialized) {
      console.warn('TTS 未初始化完成，无法播放');
      return;
    }
    
    try {
      if (isSpeaking) {
        await Tts.stop();
      }
      await Tts.speak(text);
    } catch (err: any) {
      console.error('TTS 播放失败:', err);
      setError(err instanceof Error ? err.message : '播放失败');
    }
  }, [isInitialized, isSpeaking, useHuaweiEngine, huaweiTTS, settings.enabled]);

  const stop = useCallback(async () => {
    // 使用华为TTS引擎
    if (useHuaweiEngine) {
      return huaweiTTS.stop();
    }

    // 使用标准TTS引擎
    if (!Tts || !isInitialized) {
      return;
    }

    try {
      await Tts.stop();
    } catch (err: any) {
      console.error('TTS 停止失败:', err);
      setError(err instanceof Error ? err.message : '停止失败');
    }
  }, [isInitialized, useHuaweiEngine, huaweiTTS]);

  return {
    speak,
    stop,
    isSpeaking: useHuaweiEngine ? huaweiTTS.isSpeaking : isSpeaking,
    isInitialized: useHuaweiEngine ? huaweiTTS.isInitialized : isInitialized,
    progress: useHuaweiEngine ? huaweiTTS.progress : progress,
    error: useHuaweiEngine ? huaweiTTS.error : error,
    engineReady: useHuaweiEngine || engineReady,
    settings,
    saveSettings,
    toggleEnabled,
    isHuaweiEngine: useHuaweiEngine
  };
};