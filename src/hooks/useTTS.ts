import { useEffect, useCallback, useState } from 'react';
import Tts from 'react-native-tts';

export interface TTSProgressEvent {
  location: number;
  length: number;
}

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState<TTSProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const initTTS = async () => {
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
        await Tts.setDefaultLanguage('zh-CN');
        await Tts.setDefaultRate(0.5);
        await Tts.setDefaultPitch(1.0);
        
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
      } catch (err) {
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
  }, []);

  const speak = useCallback(async (text: string) => {
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
    } catch (err) {
      console.error('TTS 播放失败:', err);
      setError(err instanceof Error ? err.message : '播放失败');
    }
  }, [isInitialized, isSpeaking]);

  const stop = useCallback(async () => {
    if (!Tts || !isInitialized) {
      return;
    }

    try {
      await Tts.stop();
    } catch (err) {
      console.error('TTS 停止失败:', err);
      setError(err instanceof Error ? err.message : '停止失败');
    }
  }, [isInitialized]);

  return {
    speak,
    stop,
    isSpeaking,
    isInitialized,
    progress,
    error,
    engineReady
  };
};