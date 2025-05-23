import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TTSSettings, DEFAULT_TTS_SETTINGS } from '@/hooks/useTTS';

// TTS设置存储键
const TTS_SETTINGS_KEY = '@ehealthApp/ttsSettings';

// 创建上下文接口
interface TTSContextType {
  settings: TTSSettings;
  updateSettings: (newSettings: Partial<TTSSettings>) => Promise<boolean>;
}

// 创建上下文
const TTSContext = createContext<TTSContextType | undefined>(undefined);

// Provider组件
export const TTSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始加载设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsStr = await AsyncStorage.getItem(TTS_SETTINGS_KEY);
        if (settingsStr) {
          const savedSettings = JSON.parse(settingsStr) as TTSSettings;
          setSettings({
            ...DEFAULT_TTS_SETTINGS,
            ...savedSettings
          });
        }
        setIsLoaded(true);
      } catch (err) {
        console.warn('加载TTS设置失败:', err);
        setIsLoaded(true);
      }
    };
    
    loadSettings();
  }, []);

  // 更新设置
  const updateSettings = async (newSettings: Partial<TTSSettings>): Promise<boolean> => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      await AsyncStorage.setItem(
        TTS_SETTINGS_KEY, 
        JSON.stringify(updatedSettings)
      );
      
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      console.error('保存TTS设置失败:', err);
      return false;
    }
  };

  // 仅在设置加载完成后渲染子组件
  if (!isLoaded) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <TTSContext.Provider value={{ settings, updateSettings }}>
      {children}
    </TTSContext.Provider>
  );
};

// 自定义Hook，用于访问上下文
export const useTTSContext = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTSContext must be used within a TTSProvider');
  }
  return context;
};
