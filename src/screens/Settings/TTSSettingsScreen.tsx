import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import Slider from '@react-native-community/slider';
import { IconButton } from 'react-native-paper';
import { useTTS } from '../../hooks/useTTS';
import { useTheme } from '@/theme';

const PREVIEW_TEXT = "这是一段测试文本，用于预览语音播报的效果。调整设置后，您可以点击此按钮试听。";

/**
 * TTS设置屏幕
 * 适老化设计，提供简单易用的语音播报设置界面
 */
export const TTSSettingsScreen = () => {
  const { 
    settings, 
    saveSettings, 
    speak, 
    stop, 
    isSpeaking,
    isHuaweiEngine  } = useTTS();
  const theme = useTheme();
  
  const [localSettings, setLocalSettings] = useState({
    ...settings
  });
  
  // 当设置变化时，更新本地状态
  useEffect(() => {
    setLocalSettings({...settings});
  }, [settings]);

  // 控制语音播报开关
  const handleToggleEnabled = async () => {
    const newEnabled = !localSettings.enabled;
    setLocalSettings(prev => ({ ...prev, enabled: newEnabled }));
    await saveSettings({ enabled: newEnabled });
  };

  // 控制自动播报开关
  const handleToggleAutoPlay = async () => {
    const newAutoPlay = !localSettings.autoPlay;
    setLocalSettings(prev => ({ ...prev, autoPlay: newAutoPlay }));
    await saveSettings({ autoPlay: newAutoPlay });
  };
  
  // 控制屏幕内容朗读开关
  const handleToggleReadScreen = async () => {
    const newReadScreen = !localSettings.readScreen;
    setLocalSettings(prev => ({ ...prev, readScreen: newReadScreen }));
    await saveSettings({ readScreen: newReadScreen });
  };
  
  // 控制播报页面切换开关
  const handleToggleAnnounceScreen = async () => {
    const newAnnounceScreen = !localSettings.announceScreen;
    setLocalSettings(prev => ({ ...prev, announceScreen: newAnnounceScreen }));
    await saveSettings({ announceScreen: newAnnounceScreen });
  };
  
  // 控制自动播报AI医生回复开关
  const handleToggleAutoReadAIResponse = async () => {
    const newAutoReadAIResponse = !localSettings.autoReadAIResponse;
    setLocalSettings(prev => ({ ...prev, autoReadAIResponse: newAutoReadAIResponse }));
    await saveSettings({ autoReadAIResponse: newAutoReadAIResponse });
  };

  // 调整语速
  const handleSpeedChange = (value: number) => {
    setLocalSettings(prev => ({ ...prev, speed: value }));
  };
  
  // 保存语速设置
  const handleSpeedChangeComplete = async (value: number) => {
    await saveSettings({ speed: value });
  };

  // 调整音量
  const handleVolumeChange = (value: number) => {
    setLocalSettings(prev => ({ ...prev, volume: value }));
  };
  
  // 保存音量设置
  const handleVolumeChangeComplete = async (value: number) => {
    await saveSettings({ volume: value });
  };
  
  // 预览语音播报
  const handlePreview = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(PREVIEW_TEXT);
    }
  };
  
  // 获取调节滑块的标签
  const getSpeedLabel = (speed: number) => {
    if (speed <= 0.4) return '非常慢';
    if (speed <= 0.7) return '较慢';
    if (speed <= 1.0) return '正常';
    if (speed <= 1.3) return '较快';
    return '非常快';
  };
  
  const getVolumeLabel = (volume: number) => {
    if (volume <= 0.25) return '较低';
    if (volume <= 0.5) return '适中';
    if (volume <= 0.75) return '较高';
    return '最高';
  };

  // 实用场景试听示例
  const previewExamples = [
    { title: '医疗提醒', text: '请记得今天下午3点在第二人民医院进行复诊。' },
    { title: '用药指导', text: '请在饭后半小时服用一粒降压药，每天三次。' },
    { title: '健康提示', text: '今天的步数目标已完成80%，再走一会儿就能达标了。' }
  ];
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgrounds.gray50.backgroundColor }]}>      <View style={styles.header}>
        <IconButton icon="cog" size={40} iconColor={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.fonts.gray800.color }]}>语音播报设置</Text>
      </View>      
      <View style={[styles.section, { backgroundColor: theme.backgrounds.gray100.backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: theme.fonts.gray800.color }]}>基本设置</Text>
        
        <View style={[styles.settingRow, { borderBottomColor: theme.colors.gray200 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.fonts.gray800.color }]}>启用语音播报</Text>
            <Text style={[styles.settingDescription, { color: theme.fonts.gray600.color }]}>
              开启后，可以使用语音播报功能
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primaryLight }}
            thumbColor={localSettings.enabled ? theme.colors.primary : theme.colors.gray400}
            ios_backgroundColor={theme.colors.gray300}
            onValueChange={handleToggleEnabled}
            value={localSettings.enabled}
            style={styles.switch}
          />
        </View>
        
        <View style={[styles.settingRow, { borderBottomColor: theme.colors.gray200 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.fonts.gray800.color }]}>自动播报重要提示</Text>
            <Text style={[styles.settingDescription, { color: theme.fonts.gray600.color }]}>
              开启后，重要提示会自动语音播报
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primaryLight }}
            thumbColor={localSettings.autoPlay ? theme.colors.primary : theme.colors.gray400}
            ios_backgroundColor={theme.colors.gray300}
            onValueChange={handleToggleAutoPlay}
            value={localSettings.autoPlay}
            style={styles.switch}
          />
        </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.gray200 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.fonts.gray800.color }]}>朗读屏幕内容</Text>
            <Text style={[styles.settingDescription, { color: theme.fonts.gray600.color }]}>
              开启后，可朗读当前屏幕上的重要内容
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primaryLight }}
            thumbColor={localSettings.readScreen ? theme.colors.primary : theme.colors.gray400}
            ios_backgroundColor={theme.colors.gray300}
            onValueChange={handleToggleReadScreen}
            value={localSettings.readScreen || false}
            style={styles.switch}
          />
        </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.gray200 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.fonts.gray800.color }]}>播报页面切换</Text>
            <Text style={[styles.settingDescription, { color: theme.fonts.gray600.color }]}>
              开启后，切换页面时会自动播报当前页面名称
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primaryLight }}
            thumbColor={localSettings.announceScreen ? theme.colors.primary : theme.colors.gray400}
            ios_backgroundColor={theme.colors.gray300}
            onValueChange={handleToggleAnnounceScreen}
            value={localSettings.announceScreen}            style={styles.switch}
          />
        </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.gray200 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.fonts.gray800.color }]}>自动播报AI医生回复</Text>
            <Text style={[styles.settingDescription, { color: theme.fonts.gray600.color }]}>
              开启后，在对话页面会自动播报AI医生的回复
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.gray300, true: theme.colors.primaryLight }}
            thumbColor={localSettings.autoReadAIResponse ? theme.colors.primary : theme.colors.gray400}
            ios_backgroundColor={theme.colors.gray300}
            onValueChange={handleToggleAutoReadAIResponse}
            value={localSettings.autoReadAIResponse || false}
            style={styles.switch}
          />
        </View>
      </View>
      
      {localSettings.enabled && (
        <View style={[styles.section, { backgroundColor: theme.backgrounds.gray100.backgroundColor }]}>
          <Text style={[styles.sectionTitle, { color: theme.fonts.gray800.color }]}>语音参数调节</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.fonts.gray800.color }]}>语速调节</Text>
            <Text style={[styles.sliderValue, { color: theme.colors.primary }]}>
              {getSpeedLabel(localSettings.speed)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.5}
              step={0.1}
              value={localSettings.speed}
              onValueChange={handleSpeedChange}
              onSlidingComplete={handleSpeedChangeComplete}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.gray300}
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderMinLabel, { color: theme.fonts.gray600.color }]}>慢</Text>
              <Text style={[styles.sliderMaxLabel, { color: theme.fonts.gray600.color }]}>快</Text>
            </View>
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.fonts.gray800.color }]}>音量调节</Text>
            <Text style={[styles.sliderValue, { color: theme.colors.primary }]}>
              {getVolumeLabel(localSettings.volume)}            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              step={0.1}
              value={localSettings.volume}
              onValueChange={handleVolumeChange}
              onSlidingComplete={handleVolumeChangeComplete}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.gray300}
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderMinLabel, { color: theme.fonts.gray600.color }]}>小</Text>
              <Text style={[styles.sliderMaxLabel, { color: theme.fonts.gray600.color }]}>大</Text>
            </View>
          </View>
            <TouchableOpacity
            style={[
              styles.previewButton,
              { backgroundColor: theme.colors.primary },
              isSpeaking ? { backgroundColor: theme.colors.error } : null
            ]}
            onPress={handlePreview}
          >            <IconButton 
              icon={isSpeaking ? "stop" : "play"} 
              size={24} 
              iconColor={theme.colors.white} 
            />            <Text style={[styles.previewButtonText, { color: theme.colors.white }]}>
              {isSpeaking ? "停止预览" : "试听效果"}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.examplesTitle, { color: theme.fonts.gray800.color }]}>实用场景试听</Text>
          <View style={styles.examplesContainer}>
            {previewExamples.map((example, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.exampleButton, { backgroundColor: theme.backgrounds.gray100.backgroundColor }]}
                onPress={() => !isSpeaking && speak(example.text)}
              >
                <Text style={[styles.exampleTitle, { color: theme.fonts.gray800.color }]}>{example.title}</Text>
                <IconButton icon="play-circle-outline" size={24} iconColor={theme.colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={[styles.infoBox, { backgroundColor: theme.backgrounds.gray100.backgroundColor }]}>
            <IconButton icon="information" size={20} iconColor={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.fonts.gray700.color }]}>
              {isHuaweiEngine 
                ? "当前使用华为语音引擎为您提供服务" 
                : "当前使用标准语音引擎为您提供服务"}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,    borderRadius: 8,
    padding: 16,
    shadowColor: "#000", // 阴影颜色保持不变，通常不需要主题适配
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sliderValue: {
    fontSize: 16,
    textAlign: 'right',
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderMinLabel: {
    fontSize: 14,
  },
  sliderMaxLabel: {
    fontSize: 14,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  previewButtonActive: {
    // Will be overridden by inline styles
  },  previewButtonText: {
    // color will be set by inline styles
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  exampleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleTitle: {
    fontSize: 16,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  }
});
