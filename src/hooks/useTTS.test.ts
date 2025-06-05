/**
 * TTS Hook 测试用例
 * 主要验证修复后的状态管理和引擎重置逻辑
 */

import { renderHook, act } from '@testing-library/react-native';
import { useTTS } from './useTTS';
import Tts from 'react-native-tts';

// Mock react-native-tts
jest.mock('react-native-tts', () => ({
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeAllListeners: jest.fn(),
  engines: jest.fn(() => Promise.resolve(['engine1'])),
}));

// Mock TTS Context
jest.mock('@/context/TTSContext', () => ({
  useTTSContext: () => ({
    settings: {
      enabled: true,
      speed: 0.5,
      volume: 1.0,
      language: 'zh-CN',
      autoPlay: true,
      announceScreen: false,
      readScreen: false,
      autoReadAIResponse: true,
    },
    updateSettings: jest.fn(() => Promise.resolve(true)),
  }),
}));

// Mock Huawei TTS
jest.mock('./useHuaweiTTS', () => ({
  useHuaweiTTS: () => ({
    isHuaweiDevice: false,
    isInitialized: false,
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeaking: false,
    progress: null,
    error: null,
  }),
}));

describe('useTTS Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确初始化TTS', async () => {
    const { result } = renderHook(() => useTTS());
    
    // 等待初始化完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    expect(result.current.isInitialized).toBe(true);
    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('zh-CN');
    expect(Tts.setDefaultRate).toHaveBeenCalledWith(0.5);
  });

  it('应该能够播放文本', async () => {
    const { result } = renderHook(() => useTTS());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    await act(async () => {
      await result.current.speak('测试文本');
    });

    expect(Tts.speak).toHaveBeenCalledWith('测试文本');
  });

  it('应该能够停止播放', async () => {
    const { result } = renderHook(() => useTTS());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    await act(async () => {
      await result.current.stop();
    });

    expect(Tts.stop).toHaveBeenCalled();
  });

  it('语速更改后应该重新设置引擎', async () => {
    const { result } = renderHook(() => useTTS());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    // 清除之前的调用
    jest.clearAllMocks();

    await act(async () => {
      await result.current.saveSettings({ speed: 1.0 });
    });

    // 验证引擎重置和参数设置
    expect(Tts.setDefaultRate).toHaveBeenCalledWith(1.0);
  });

  it('播放时应该正确管理状态', async () => {
    const { result } = renderHook(() => useTTS());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    // 模拟TTS开始事件
    const startCallback = (Tts.addEventListener as jest.Mock).mock.calls
      .find(call => call[0] === 'tts-start')?.[1];
    
    if (startCallback) {
      act(() => {
        startCallback();
      });
      
      expect(result.current.isSpeaking).toBe(true);
    }

    // 模拟TTS结束事件
    const finishCallback = (Tts.addEventListener as jest.Mock).mock.calls
      .find(call => call[0] === 'tts-finish')?.[1];
    
    if (finishCallback) {
      act(() => {
        finishCallback();
      });
      
      expect(result.current.isSpeaking).toBe(false);
    }
  });

  it('TTS禁用时不应该播放', async () => {
    // Mock disabled settings
    jest.doMock('@/context/TTSContext', () => ({
      useTTSContext: () => ({
        settings: {
          enabled: false,
          speed: 0.5,
          volume: 1.0,
          language: 'zh-CN',
          autoPlay: false,
          announceScreen: false,
          readScreen: false,
          autoReadAIResponse: false,
        },
        updateSettings: jest.fn(() => Promise.resolve(true)),
      }),
    }));

    const { result } = renderHook(() => useTTS());
    
    await act(async () => {
      await result.current.speak('测试文本');
    });

    expect(Tts.speak).not.toHaveBeenCalled();
  });
});
