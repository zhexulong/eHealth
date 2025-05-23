import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTTS } from '@/hooks/useTTS';
import { PlayProgressBar } from '@/components/atoms/PlayProgressBar';

interface ElderlyTTSControlProps {
  /**
   * 要播放的文本内容
   */
  text: string;
  /**
   * 朗读按钮标签
   */
  label?: string;
  /**
   * 按钮大小
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 是否自动播放文本
   */
  autoPlay?: boolean;
  /**
   * 自定义样式
   */
  style?: any;
}

/**
 * 适老化语音播报控制组件
 * 提供清晰、大尺寸的语音播报按钮，适合老年用户使用
 */
export const ElderlyTTSControl: React.FC<ElderlyTTSControlProps> = ({ 
  text, 
  label = '朗读内容',
  size = 'medium',
  autoPlay = false,
  style
}) => {
  const { speak, stop, isSpeaking, progress, settings } = useTTS();
  const [showHint, setShowHint] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // 自动播放逻辑
  useEffect(() => {
    if (autoPlay && settings.enabled && settings.autoPlay && !hasPlayed) {
      speak(text);
      setHasPlayed(true);
    }
  }, [autoPlay, settings.enabled, settings.autoPlay, text, speak, hasPlayed]);

  const handlePress = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
      // 首次使用时显示提示
      if (!showHint) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 5000);
      }
    }
  };

  // 根据size确定图标和文字大小
  const getStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 24,
          fontSize: 16,
          padding: 8
        };
      case 'large':
        return {
          iconSize: 40,
          fontSize: 24,
          padding: 20
        };
      case 'medium':
      default:
        return {
          iconSize: 32,
          fontSize: 20,
          padding: 16
        };
    }
  };
  
  const { iconSize, fontSize, padding } = getStyles();

  // 如果TTS功能已禁用，则不显示控件
  if (!settings.enabled) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        onPress={handlePress}
        style={[styles.button, { padding }]}
        accessibilityLabel={isSpeaking ? "停止朗读" : "开始朗读"}
        accessibilityHint="按下可控制文字朗读功能"
        accessibilityRole="button"
      >
        <Icon 
          name={isSpeaking ? "stop" : "volume-up"} 
          size={iconSize} 
          color="#2196F3" 
        />
        <Text style={[styles.label, { fontSize }]}>
          {isSpeaking ? "停止朗读" : label}
        </Text>
      </TouchableOpacity>
      
      {isSpeaking && <PlayProgressBar progress={progress} />}
      
      {showHint && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            点击此按钮可以朗读文字内容
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
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    minWidth: 200,
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#2196F3',
  },
  hint: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    maxWidth: '90%',
  },
  hintText: {
    fontSize: 16,
    color: '#555',
  }
});
