import React, { useEffect, useCallback, useRef } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View,
  Text
} from 'react-native';
import { useTTS } from '@/hooks/useTTS';

interface TTSScreenReaderProps {
  screenText: string;
  importantMessage?: string;
}

/**
 * 屏幕内容朗读组件
 * 用于显示在各个屏幕上，提供朗读当前屏幕内容的功能
 */
export const TTSScreenReader: React.FC<TTSScreenReaderProps> = ({
  screenText,
  importantMessage
}) => {
  const { speak, stop, isSpeaking, settings } = useTTS();
  const lastPressTime = useRef<number>(0);
  const lastContent = useRef<string>('');

  // 清理函数
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stop();
      }
    };
  }, [isSpeaking, stop]);

  // 处理按钮点击逻辑，添加防抖动
  const handlePress = useCallback(() => {
    const now = Date.now();
    // 防抖动：500ms内的重复点击将被忽略
    if (now - lastPressTime.current < 500) {
      return;
    }
    lastPressTime.current = now;

    if (isSpeaking) {
      stop();
    } else {
      // 检查内容是否发生变化
      if (screenText !== lastContent.current) {
        lastContent.current = screenText;
        speak(screenText);
      } else {
        // 如果内容没有变化且正在朗读，则停止朗读
        stop();
      }
    }
  }, [isSpeaking, screenText, speak, stop]);

  // 根据设置决定是否渲染组件
  if (!settings.enabled) return null;
  if (!settings.readScreen && !importantMessage) return null;
  if (!settings.readScreen) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isSpeaking && styles.activeButton]}
        onPress={handlePress}
        accessibilityLabel={isSpeaking ? "停止朗读" : "朗读屏幕内容"}
      >        {/* 使用文本代替图标 */}
        <Text style={[styles.iconText, { color: 'white' }]}>
          {isSpeaking ? '🔊' : '🔉'}
        </Text>
        <Text style={styles.buttonText}>
          {isSpeaking ? "停止朗读" : "朗读内容"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
  },
  button: {
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  iconText: {
    fontSize: 18,
    marginRight: 4,
  }
});
