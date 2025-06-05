import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTTS } from '@/hooks/useTTS';
import { ElderlyTTSControl } from '@/components/atoms/ElderlyTTSControl';
import { useTheme } from '@/theme';

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
  const { colors } = useTheme();
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
        return { backgroundColor: colors.warning + '20', borderLeftColor: colors.warning };
      case 'critical':
        return { backgroundColor: colors.error + '20', borderLeftColor: colors.error };
      case 'normal':
      default:
        return { backgroundColor: colors.info + '20', borderLeftColor: colors.info };
    }
  };
  
  const getTitleStyle = () => {
    switch (importance) {
      case 'important':
        return { color: colors.warning };
      case 'critical':
        return { color: colors.error };
      case 'normal':
      default:
        return { color: colors.info };
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
        />      </View>
      <Text style={[styles.message, { color: colors.gray800 }, messageStyle]}>{message}</Text>
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
  }
});
