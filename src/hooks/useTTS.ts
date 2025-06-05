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
  
  // TTS引擎重置函数 - 解决语速更改后第二次使用失效问题
  const resetTTSEngineInternal = async () => {
    if (!Tts || useHuaweiEngine) return;
    
    try {
      console.log('重置TTS引擎开始');
      
      // 1. 停止所有播放
      await Tts.stop();
      setIsSpeaking(false);
      
      // 2. 给系统一点时间重置状态
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 3. 移除所有事件监听器
      try {
        Tts.removeAllListeners('tts-start');
        Tts.removeAllListeners('tts-progress');
        Tts.removeAllListeners('tts-finish');
        Tts.removeAllListeners('tts-cancel');
      } catch (listenerErr) {
        console.warn('移除TTS监听器失败:', listenerErr);
      }
      
      // 4. 重新添加监听器
      Tts.addEventListener('tts-start', () => {
        setIsSpeaking(true);
        setProgress({ location: 0, length: 1 });
      });
      
      Tts.addEventListener('tts-progress', (event: TTSProgressEvent) => {
        setProgress(event);
      });
      
      Tts.addEventListener('tts-finish', () => {
        setIsSpeaking(false);
        setProgress(null);
      });
      
      Tts.addEventListener('tts-cancel', () => {
        setIsSpeaking(false);
        setProgress(null);
      });
      
      // 5. 通过直接调用底层引擎API重置状态
      // 对Android，尝试清理队列
      if (Platform.OS === 'android') {
        // @ts-ignore - 访问可能存在的非公开API
        if (typeof Tts.clearQueue === 'function') {
          // @ts-ignore
          await Tts.clearQueue();
        }
      }
      
      // 6. 重设所有TTS参数，确保引擎状态一致
      await Tts.setDefaultRate(settings.speed);
      await Tts.setDefaultLanguage(settings.language);
      
      // 7. 重置错误状态
      setError(null);
      
      console.log('TTS引擎已重置完成，当前语速:', settings.speed);
    } catch (err) {
      console.error('重置TTS引擎失败:', err);
      setError(err instanceof Error ? err.message : '重置失败');
      throw err; // 将错误向上传播
    }
  };
  
  // 重新初始化TTS引擎
  const reinitializeTTS = useCallback(async () => {
    try {
      await resetTTSEngineInternal();
    } catch (err) {
      console.error('重新初始化TTS引擎失败:', err);
    }
  }, [settings.language, settings.speed, useHuaweiEngine]);
  
  // 完全重置TTS引擎 - 外部接口
  const resetTTSEngine = useCallback(async () => {
    try {
      await resetTTSEngineInternal();
    } catch (err) {
      console.error('完全重置TTS引擎失败:', err);
    }
  }, [settings.language, settings.speed, useHuaweiEngine]);
  // 保存设置
  const saveSettings = useCallback(async (newSettings: Partial<TTSSettings>) => {
    try {
      // 使用全局上下文的updateSettings方法
      const success = await updateSettings(newSettings);
      
      // 如果使用标准TTS且已初始化，同步更新TTS引擎参数
      if (success && isInitialized && !useHuaweiEngine && Tts) {
        try {
          let needsReset = false;
          
          // 检测是否需要完全重置引擎
          if (newSettings.speed !== undefined && newSettings.speed !== settings.speed) {
            console.log('语速已变更为:', newSettings.speed);
            needsReset = true;
          }
          
          if (newSettings.language !== undefined && newSettings.language !== settings.language) {
            console.log('语言已变更为:', newSettings.language);
            needsReset = true;
          }
          
          // 如果语速或语言发生变化，完全重置TTS引擎
          if (needsReset) {
            console.log('关键参数变更，立即重置TTS引擎');
            
            // 先停止当前播放
            if (isSpeaking) {
              await Tts.stop();
              setIsSpeaking(false);
            }
            
            // 强制应用新参数并重置引擎状态
            await resetTTSEngineInternal();
          } else {
            // 如果只是其他设置变更，只需要更新参数
            if (newSettings.speed !== undefined) {
              await Tts.setDefaultRate(newSettings.speed);
            }
            if (newSettings.language !== undefined) {
              await Tts.setDefaultLanguage(newSettings.language);
            }
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
  }, [settings, isInitialized, useHuaweiEngine, updateSettings, isSpeaking]);

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
  
  // 监听设置变化，在关键参数变更时重新初始化TTS
  useEffect(() => {
    if (isInitialized && !useHuaweiEngine) {
      // 使用setTimeout延迟执行，确保设置已经完全更新
      const timer = setTimeout(() => {
        console.log('设置变更，重新初始化TTS引擎，速度:', settings.speed);
        reinitializeTTS();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [settings.speed, settings.language, reinitializeTTS, isInitialized, useHuaweiEngine]);

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
  }, [huaweiTTS.isInitialized, huaweiTTS.isHuaweiDevice, settings]);  // 播放TTS
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
      // 只有在确实需要时才重置引擎（避免每次都重置导致状态混乱）
      // 检查当前是否正在播放其他内容，如果是则停止
      if (isSpeaking) {
        console.log('停止当前播放，准备播放新内容');
        await Tts.stop();
        // 给系统时间停止当前播放
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 确保参数已应用
      await Tts.setDefaultRate(settings.speed);
      await Tts.setDefaultLanguage(settings.language);

      // 立即设置播放状态，确保UI能够及时响应
      setIsSpeaking(true);
      setProgress({ location: 0, length: 1 });

      // 开始播放
      console.log('开始播放TTS，当前语速:', settings.speed);
      await Tts.speak(text);
    } catch (err: any) {
      console.error('TTS 播放失败:', err);
      setError(err instanceof Error ? err.message : '播放失败');
      // 如果播放失败，恢复状态
      setIsSpeaking(false);
      setProgress(null);
    }
  }, [settings, isInitialized, useHuaweiEngine, huaweiTTS, isSpeaking]);
  // 停止播放
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
      // 立即设置停止状态，确保UI能够及时响应
      setIsSpeaking(false);
      setProgress(null);
      
      await Tts.stop();
    } catch (err: any) {
      console.error('TTS 停止失败:', err);
      setError(err instanceof Error ? err.message : '停止失败');
      // 即使停止失败，也要确保状态正确
      setIsSpeaking(false);
      setProgress(null);
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
    resetTTSEngine, // 暴露引擎重置方法，以备特殊情况使用
    isHuaweiEngine: useHuaweiEngine
  };
};