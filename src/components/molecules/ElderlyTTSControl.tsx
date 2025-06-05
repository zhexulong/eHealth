import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { useTTS } from '../../hooks/useTTS';
import { useTheme } from '@/theme';

interface ElderlyTTSControlProps {
  text: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

/**
 * 适老化文本语音播报控件
 * 为老年用户提供大按钮、明显的视觉反馈和简单的操作方式
 */
export const ElderlyTTSControl: React.FC<ElderlyTTSControlProps> = ({ 
  text, 
  label = '语音播报',
  size = 'medium',
  autoPlay = false,
  onPlayStateChange
}) => {
  const { colors } = useTheme();
  const { speak, stop, isSpeaking, engineReady, settings } = useTTS();
  const [showHint, setShowHint] = useState(true);

  React.useEffect(() => {
    // 自动播放（如果启用）
    if (autoPlay && engineReady && settings.enabled && settings.autoPlay && text) {
      speak(text);
    }
    
    // 3秒后隐藏提示
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      if (isSpeaking) {
        stop();
      }
    };
  }, [text, autoPlay, engineReady, settings.enabled, settings.autoPlay]);

  // 状态变化通知
  React.useEffect(() => {
    onPlayStateChange && onPlayStateChange(isSpeaking);
  }, [isSpeaking, onPlayStateChange]);

  const handlePress = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
      setShowHint(true);
      // 3秒后隐藏提示
      setTimeout(() => {
        setShowHint(false);
      }, 3000);
    }
  };

  // 基于尺寸调整样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          button: { padding: 8, minWidth: 120 },
          icon: 24,
          text: { fontSize: 16 }
        };
      case 'large':
        return {
          button: { padding: 20, minWidth: 240 },
          icon: 40,
          text: { fontSize: 24 }
        };
      default: // medium
        return {
          button: { padding: 16, minWidth: 200 },
          icon: 32,
          text: { fontSize: 20 }
        };
    }
  };
  
  const sizeStyles = getSizeStyles();

  // TTS不可用或被禁用时，不显示控件
  if (!engineReady || !settings.enabled) {
    return null;
  }

  return (
    <View style={styles.container}>      <TouchableOpacity 
        onPress={handlePress}
        style={[
          styles.button, 
          { backgroundColor: isSpeaking ? colors.error : colors.primaryLight },
          sizeStyles.button,
        ]}
        accessibilityLabel={isSpeaking ? "停止朗读" : label}
        accessibilityHint="按下可控制文字朗读功能"
        accessibilityRole="button"      >
        <Icon 
          source={isSpeaking ? "stop" : "text-to-speech"} 
          size={sizeStyles.icon} 
          color={isSpeaking ? colors.white : colors.primaryDark} 
        />
        <Text style={[
          styles.label, 
          { color: isSpeaking ? colors.white : colors.primaryDark },
          sizeStyles.text,
          { marginLeft: 8 }
        ]}>
          {isSpeaking ? "停止朗读" : label}
        </Text>
      </TouchableOpacity>
        {showHint && (
        <View style={[styles.hint, { backgroundColor: colors.primary + '1A' }]}>
          <Text style={[styles.hintText, { color: colors.gray700 }]}>
            {isSpeaking ? "正在为您朗读内容" : "点击此按钮可以朗读文字内容"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: "#000", // 阴影颜色保持不变，通常不需要主题适配
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  hint: {
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    maxWidth: '90%',
  },
  hintText: {
    fontSize: 16,
  }
});
