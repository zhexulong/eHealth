import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text,
  View
} from 'react-native';
import { useTTS } from '@/hooks/useTTS';

interface HeaderTTSButtonProps {
  screenText: string;
}

/**
 * 头部导航栏中的TTS按钮组件
 */
export const HeaderTTSButton: React.FC<HeaderTTSButtonProps> = ({
  screenText
}) => {
  const { speak, stop, isSpeaking, settings } = useTTS();
  
  // 处理按钮点击
  const handlePress = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(screenText);
    }
  };

  // 如果TTS功能被禁用，则不显示按钮
  if (!settings.enabled || !settings.readScreen) return null;
  
  return (
    <TouchableOpacity
      style={[styles.button, isSpeaking && styles.activeButton]}
      onPress={handlePress}
      accessibilityLabel={isSpeaking ? "停止朗读" : "朗读屏幕内容"}
    >
      <Text style={[styles.iconText, { color: 'white' }]}>
        {isSpeaking ? '🔊' : '🔉'}
      </Text>
      <Text style={styles.buttonText}>
        {isSpeaking ? "停止" : "朗读内容"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconText: {
    fontSize: 16,
    marginRight: 4,
  }
});
