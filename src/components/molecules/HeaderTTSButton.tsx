import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useTTS } from '@/hooks/useTTS';
import { useTheme } from '@/theme';

interface HeaderTTSButtonProps {
  screenText: string;
}

/**
 * 头部导航栏中的TTS按钮组件
 */
export const HeaderTTSButton: React.FC<HeaderTTSButtonProps> = ({
  screenText
}) => {
  const { colors } = useTheme();
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
    <TouchableOpacity      style={[
        styles.button, 
        { backgroundColor: isSpeaking ? colors.error : colors.primaryLight }
      ]}
      onPress={handlePress}
      accessibilityLabel={isSpeaking ? "停止朗读" : "朗读屏幕内容"}>      <Icon 
        source={isSpeaking ? "stop" : "text-to-speech"} 
        size={28} 
        color={isSpeaking ? colors.white : colors.primaryDark} 
      />
      <Text style={[
        styles.buttonText, 
        { color: isSpeaking ? colors.white : colors.primaryDark }
      ]}>
        {isSpeaking ? "停止" : "朗读内容"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  iconText: {
    fontSize: 16,
    marginRight: 4,
  }
});
