import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTTS } from '@/hooks/useTTS';
import { ElderlyTTSControl } from '@/components/atoms/ElderlyTTSControl';

interface VoiceAnnouncementProps {
  /**
   * 公告标题
   */
  title: string;
  /**
   * 公告内容
   */
  message: string;
  /**
   * 重要程度，影响样式
   */
  importance?: 'normal' | 'important' | 'critical';
  /**
   * 是否自动朗读
   */
  autoPlay?: boolean;
  /**
   * 自定义容器样式
   */
  style?: ViewStyle;
  /**
   * 自定义标题样式
   */
  titleStyle?: TextStyle;
  /**
   * 自定义消息样式
   */
  messageStyle?: TextStyle;
}

/**
 * 语音公告组件
 * 用于显示重要信息并提供语音播报功能，特别适合老年用户
 */
export const VoiceAnnouncement: React.FC<VoiceAnnouncementProps> = ({
  title,
  message,
  importance = 'normal',
  autoPlay = false,
  style,
  titleStyle,
  messageStyle
}) => {
  const { speak, settings } = useTTS();
  
  // 根据重要程度自动播放
  useEffect(() => {
    if (autoPlay && settings.enabled && settings.autoPlay) {
      // 对于重要和关键信息自动朗读
      if (importance === 'important' || importance === 'critical') {
        const content = `${title}。${message}`;
        speak(content);
      }
    }
  }, [title, message, importance, autoPlay, settings.enabled, settings.autoPlay, speak]);
  
  // 根据重要程度选择不同的样式
  const getContainerStyle = () => {
    switch (importance) {
      case 'important':
        return styles.importantContainer;
      case 'critical':
        return styles.criticalContainer;
      case 'normal':
      default:
        return styles.normalContainer;
    }
  };
  
  const getTitleStyle = () => {
    switch (importance) {
      case 'important':
        return styles.importantTitle;
      case 'critical':
        return styles.criticalTitle;
      case 'normal':
      default:
        return styles.normalTitle;
    }
  };
  
  return (
    <View style={[styles.container, getContainerStyle(), style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, getTitleStyle(), titleStyle]}>{title}</Text>
        <ElderlyTTSControl 
          text={`${title}。${message}`}
          label="朗读"
          size="small"
        />
      </View>
      <Text style={[styles.message, messageStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    borderLeftWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  normalContainer: {
    backgroundColor: '#f0f7ff',
    borderLeftColor: '#2196F3',
  },
  importantContainer: {
    backgroundColor: '#fff9e6',
    borderLeftColor: '#FFA000',
  },
  criticalContainer: {
    backgroundColor: '#fee',
    borderLeftColor: '#D32F2F',
  },
  normalTitle: {
    color: '#0D47A1',
  },
  importantTitle: {
    color: '#E65100',
  },
  criticalTitle: {
    color: '#B71C1C',
  }
});
