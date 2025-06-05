import React, { useEffect, useCallback, useRef } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View,
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useTTS } from '@/hooks/useTTS';
import { useTheme } from '@/theme';

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
  const { colors } = useTheme();
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

  return (    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary + 'CC' }, isSpeaking && { backgroundColor: colors.error + 'CC' }]}
        onPress={handlePress}        accessibilityLabel={isSpeaking ? "停止朗读" : "朗读屏幕内容"}      >        {/* 使用react-native-paper图标 */}        <Icon 
          source={isSpeaking ? "stop" : "text-to-speech"} 
          size={28} 
          color={colors.white} 
        />
        <Text style={[styles.buttonText, { color: colors.white }]}>
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
  },  button: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000", // 阴影颜色保持不变，通常不需要主题适配
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
    marginRight: 4,
  }
});
