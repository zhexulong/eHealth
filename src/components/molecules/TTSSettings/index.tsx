import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTTS } from '@/hooks/useTTS';
import { useTheme } from '@/theme';

interface TTSSettingsProps {
  /**
   * 标题
   */
  title?: string;
  /**
   * 测试文本
   */
  testText?: string;
  /**
   * 自定义样式
   */
  style?: any;
}

/**
 * TTS设置组件
 * 提供适老化文本朗读相关的设置项
 */
export const TTSSettings: React.FC<TTSSettingsProps> = ({ 
  title = '语音播报设置',
  testText = '这是一段测试文本，您可以调整语速来测试效果。',
  style 
}) => {
  const { colors, backgrounds, fonts } = useTheme();
  const { 
    settings, 
    saveSettings, 
    toggleEnabled,
    speak,
    stop,
    isSpeaking,
    isHuaweiEngine
  } = useTTS();
  
  const [localSpeed, setLocalSpeed] = useState(settings.speed);
  
  const handleToggleEnabled = async () => {
    const newState = await toggleEnabled();
    if (!newState) {
      Alert.alert(
        '已关闭语音播报',
        '您已关闭语音朗读功能，适老化语音朗读将不再可用。',
        [{ text: '确定', style: 'default' }]
      );
    } else {
      Alert.alert(
        '已开启语音播报',
        '您已开启语音朗读功能，可点击朗读按钮听取内容。',
        [{ text: '确定', style: 'default' }]
      );
    }
  };
  
  const handleToggleAutoPlay = async () => {
    await saveSettings({ autoPlay: !settings.autoPlay });
  };
  
  const handleSpeedChange = (value: number) => {
    setLocalSpeed(value);
  };
  
  const handleSpeedChangeComplete = async () => {
    await saveSettings({ speed: localSpeed });
  };
  
  const handleTestSpeech = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(testText);
    }
  };  return (
    <ScrollView style={[styles.container, { backgroundColor: backgrounds.gray50.backgroundColor }, style]}>
      <Text style={[styles.title, { color: colors.gray800 }]}>{title}</Text>
      
      <View style={[styles.settingRow, { borderBottomColor: colors.gray200 }]}>
        <View style={styles.settingLabelContainer}>
          <Text style={[styles.settingLabel, { color: colors.gray800 }]}>启用语音播报</Text>
          <Text style={[styles.settingDescription, { color: colors.gray600 }]}>
            开启后可使用语音朗读功能
          </Text>
        </View>
        <Switch 
          value={settings.enabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: colors.gray400, true: colors.success }}
          thumbColor={colors.white}
        />
      </View>
      
      {settings.enabled && (
        <>
          <View style={[styles.settingRow, { borderBottomColor: colors.gray200 }]}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.gray800 }]}>自动播报重要信息</Text>
              <Text style={[styles.settingDescription, { color: colors.gray600 }]}>
                开启后重要提示会自动语音播报
              </Text>
            </View>
            <Switch 
              value={settings.autoPlay}
              onValueChange={handleToggleAutoPlay}
              trackColor={{ false: colors.gray400, true: colors.success }}              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingBlock}>
            <Text style={[styles.settingLabel, { color: colors.gray800 }]}>语速调节</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={isHuaweiEngine ? 2.0 : 1.0}
              step={0.1}
              value={localSpeed}
              onValueChange={handleSpeedChange}
              onSlidingComplete={handleSpeedChangeComplete}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.gray300}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: colors.gray600 }]}>慢</Text>
              <Text style={[styles.sliderValue, { color: colors.primary }]}>{localSpeed.toFixed(1)}x</Text>
              <Text style={[styles.sliderLabel, { color: colors.gray600 }]}>快</Text>
            </View>
          </View>
          
          <View style={styles.testContainer}>
            <TouchableOpacity 
              style={[styles.testButton, { backgroundColor: colors.primary }]}
              onPress={handleTestSpeech}
            >
              <Text style={[styles.testButtonText, { color: colors.white }]}>
                {isSpeaking ? '停止测试' : '测试语音播报'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.engineInfo, { color: colors.gray600 }]}>
              当前使用{isHuaweiEngine ? '华为' : '系统'}语音引擎
            </Text>
          </View>
        </>
      )}
      
      <View style={[styles.noteContainer, { backgroundColor: backgrounds.gray100.backgroundColor }]}>
        <Text style={[styles.noteTitle, { color: colors.gray800 }]}>使用提示</Text>
        <Text style={[styles.noteText, { color: colors.gray700 }]}>
          1. 语音播报功能可帮助您获取屏幕上的重要信息{'\n'}
          2. 部分页面提供朗读按钮，点击即可收听内容{'\n'}
          3. 自动播报功能会朗读重要提醒或警告信息{'\n'}
          4. 调整语速可以获得更舒适的聆听体验
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  settingBlock: {
    marginTop: 24,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  engineInfo: {
    marginTop: 12,
    fontSize: 14,
  },
  noteContainer: {
    marginTop: 40,
    padding: 16,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
  }
});
