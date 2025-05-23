import { useEffect, useCallback, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HMSMLText } from '@hmscore/react-native-hms-ml';

// HMS ML Kit TTS设置存储键
const HMS_TTS_SETTINGS_KEY = '@ehealthApp/hmsTtsSettings';

interface HuaweiTTSOptions {
  text: string;
  language?: string;
  person?: string;
  speed?: number;
  volume?: number;
}

// 华为TTS设置接口
export interface HuaweiTTSSettings {
  enabled: boolean;
  speed: number;
  volume: number;
  language: string;
  person: string;
}

// 默认华为TTS设置
export const DEFAULT_HMS_TTS_SETTINGS: HuaweiTTSSettings = {
  enabled: true,
  speed: 1.0,
  volume: 1.0,
  language: 'zh-CN',
  person: 'zh-CN-st-1', // 默认中文女声
};

// 华为ML Kit TTS进度事件接口
export interface HuaweiTTSProgressEvent {
  location: number;
  length: number;
}

export interface HuaweiTTSProgressEvent {
  location: number;
  length: number;
}

/**
 * 判断是否是华为设备且没有谷歌服务
 */
const isHuaweiWithoutGMS = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  
  try {
    // 尝试获取设备制造商
    const { Brand } = NativeModules.RNDeviceInfo || {};
    if (!Brand) return false;
    
    const brand = (await Brand).toLowerCase();
    
    // 检查是否能使用Google Play服务
    const { isAvailable } = NativeModules.RNGoogleSignin || {};
    if (!isAvailable) return false;
    
    const hasGoogleServices = await isAvailable();
    
    return brand.includes('huawei') && !hasGoogleServices;
  } catch (err) {
    // 如果无法获取设备信息或Google服务状态，保守返回false
    return false;
  }
};

/**
 * 华为设备文字转语音Hook
 */
export const useHuaweiTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState<HuaweiTTSProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHuaweiDevice, setIsHuaweiDevice] = useState(false);
  const [settings, setSettings] = useState<HuaweiTTSSettings>(DEFAULT_HMS_TTS_SETTINGS);

  // 加载设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsStr = await AsyncStorage.getItem(HMS_TTS_SETTINGS_KEY);
        if (settingsStr) {
          const savedSettings = JSON.parse(settingsStr) as HuaweiTTSSettings;
          setSettings({
            ...DEFAULT_HMS_TTS_SETTINGS,
            ...savedSettings
          });
        }
      } catch (err) {
        console.warn('加载HMS TTS设置失败:', err);
      }
    };
    
    loadSettings();
  }, []);

  // 保存设置
  const saveSettings = useCallback(async (newSettings: Partial<HuaweiTTSSettings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      await AsyncStorage.setItem(
        HMS_TTS_SETTINGS_KEY, 
        JSON.stringify(updatedSettings)
      );
      
      setSettings(updatedSettings);
      
      // 如果TTS已初始化，则同步更新TTS引擎参数
      if (isInitialized && isHuaweiDevice) {
        const { HMSMLText } = NativeModules;
        await HMSMLText.setTtsEngineParams({
          language: updatedSettings.language,
          person: updatedSettings.person,
          speed: updatedSettings.speed,
          volume: updatedSettings.volume
        });
      }
      
      return true;
    } catch (err) {
      console.error('保存HMS TTS设置失败:', err);
      return false;
    }
  }, [settings, isInitialized, isHuaweiDevice]);

  useEffect(() => {
    let isMounted = true;
    
    const initTTS = async () => {
      try {
        // 检查是否是华为设备且没有谷歌服务
        const huaweiWithoutGMS = await isHuaweiWithoutGMS();
        if (isMounted) setIsHuaweiDevice(huaweiWithoutGMS);
        
        if (!huaweiWithoutGMS) {
          // 不是华为设备或有谷歌服务，不需要初始化
          return;
        }
          // 初始化华为TTS引擎
        try {
          // 创建TTS回调
          const ttsCallback = {
            onError: (errorCode: number, errorMessage: string) => {
              if (isMounted) {
                setError(`TTS错误 (${errorCode}): ${errorMessage}`);
                setIsSpeaking(false);
              }
            },
            onWarn: (warnCode: number, warnMessage: string) => {
              console.warn(`TTS警告 (${warnCode}): ${warnMessage}`);
            },
            onRangeStart: (start: number, end: number) => {
              if (isMounted) {
                setProgress({
                  location: start,
                  length: end - start
                });
              }
            },
            onAudioAvailable: () => {
              // 音频准备就绪
            },
            onEvent: (eventId: number) => {
              // 事件回调，eventId为2时表示语音合成已完成
              if (eventId === 2 && isMounted) {
                setIsSpeaking(false);
                setProgress(null);
              }
            }
          };
          
          // 初始化TTS引擎配置
          await HMSMLText.mlTtsAnalyserSetting({
            language: settings.language,
            person: settings.person,
            speed: settings.speed,
            volume: settings.volume
          });
          
          // 设置TTS回调
          await HMSMLText.mlTtsAnalyserSetTtsCallback(ttsCallback);
          
          if (isMounted) {
            setIsInitialized(true);
            setError(null);
          }        } catch (e: any) {
          if (isMounted) {
            setError(`HMS ML Kit TTS初始化失败: ${e.message}`);
            setIsInitialized(false);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(`TTS检测失败: ${err.message}`);
        }
      }
    };
    
    initTTS();
    
    return () => {
      isMounted = false;
      // 清理TTS资源
      if (isHuaweiDevice && isInitialized) {
        try {
          const { HMSMLText } = NativeModules;
          HMSMLText?.stopTts();
        } catch (e) {
          console.warn('清理华为TTS资源失败:', e);
        }
      }
    };
  }, [settings]);
  /**
   * 播放语音
   */
  const speak = useCallback(async (text: string, options?: Partial<HuaweiTTSOptions>) => {
    if (!isInitialized || !isHuaweiDevice || !settings.enabled) {
      return false;
    }
    
    try {
      // 如果当前正在播放，先停止
      if (isSpeaking) {
        await HMSMLText.mlTtsAnalyserPause();
      }
      
      setIsSpeaking(true);
      setProgress({ location: 0, length: text.length });
      
      // 设置TTS参数（如果有自定义参数）
      if (options && (options.language || options.person || options.speed !== undefined || options.volume !== undefined)) {
        await HMSMLText.mlTtsAnalyserSetting({
          language: options.language || settings.language,
          person: options.person || settings.person,
          speed: options.speed !== undefined ? options.speed : settings.speed,
          volume: options.volume !== undefined ? options.volume : settings.volume
        });
      }
      
      // 调用HMS ML Kit TTS API
      await HMSMLText.mlTtsAnalyserSpeak(text);
      
      return true;    } catch (err: any) {
      setError(`语音播放失败: ${err.message}`);
      setIsSpeaking(false);
      return false;
    }
  }, [isInitialized, isSpeaking, isHuaweiDevice, settings]);
  /**
   * 停止播放
   */
  const stop = useCallback(async () => {
    if (!isInitialized || !isHuaweiDevice) {
      return false;
    }
    
    try {
      await HMSMLText.mlTtsAnalyserStop();
      setIsSpeaking(false);
      setProgress(null);
      return true;    } catch (err: any) {
      setError(`停止播放失败: ${err.message}`);
      return false;
    }
  }, [isInitialized, isHuaweiDevice]);
  /**
   * 修改TTS参数
   */
  const setParams = useCallback(async (options: Partial<HuaweiTTSOptions>) => {
    if (!isInitialized || !isHuaweiDevice) {
      return false;
    }
    
    try {
      await HMSMLText.mlTtsAnalyserSetting({
        language: options.language,
        person: options.person,
        speed: options.speed,
        volume: options.volume
      });
      return true;    } catch (err: any) {
      setError(`设置TTS参数失败: ${err.message}`);
      return false;
    }
  }, [isInitialized, isHuaweiDevice]);

  /**
   * 切换语音播放启用状态
   */
  const toggleEnabled = useCallback(async () => {
    const newEnabled = !settings.enabled;
    const success = await saveSettings({ enabled: newEnabled });
    return success ? newEnabled : settings.enabled;
  }, [settings, saveSettings]);

  return {
    speak,
    stop,
    setParams,
    isSpeaking,
    isInitialized,
    isHuaweiDevice,
    progress,
    error,
    settings,
    saveSettings,
    toggleEnabled
  };
};
