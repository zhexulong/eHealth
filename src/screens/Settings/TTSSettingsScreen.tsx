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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTTS } from '../../hooks/useTTS';
import { useHuaweiTTS } from '../../hooks/useHuaweiTTS';

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
    isHuaweiEngine
  } = useTTS();
  
  const huaweiTTS = useHuaweiTTS();
  
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="settings-voice" size={40} color="#2196F3" />
        <Text style={styles.title}>语音播报设置</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本设置</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>启用语音播报</Text>
            <Text style={styles.settingDescription}>
              开启后，可以使用语音播报功能
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#cccccc", true: "#81b0ff" }}
            thumbColor={localSettings.enabled ? "#2196F3" : "#f4f3f4"}
            ios_backgroundColor="#cccccc"
            onValueChange={handleToggleEnabled}
            value={localSettings.enabled}
            style={styles.switch}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>自动播报重要提示</Text>
            <Text style={styles.settingDescription}>
              开启后，重要提示会自动语音播报
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#cccccc", true: "#81b0ff" }}
            thumbColor={localSettings.autoPlay ? "#2196F3" : "#f4f3f4"}
            ios_backgroundColor="#cccccc"
            onValueChange={handleToggleAutoPlay}
            value={localSettings.autoPlay}
            style={styles.switch}
          />
        </View>
          <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>朗读屏幕内容</Text>
            <Text style={styles.settingDescription}>
              开启后，可朗读当前屏幕上的重要内容
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#cccccc", true: "#81b0ff" }}
            thumbColor={localSettings.readScreen ? "#2196F3" : "#f4f3f4"}
            ios_backgroundColor="#cccccc"
            onValueChange={handleToggleReadScreen}
            value={localSettings.readScreen || false}
            style={styles.switch}
          />
        </View>
          <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>播报页面切换</Text>
            <Text style={styles.settingDescription}>
              开启后，切换页面时会自动播报当前页面名称
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#cccccc", true: "#81b0ff" }}
            thumbColor={localSettings.announceScreen ? "#2196F3" : "#f4f3f4"}
            ios_backgroundColor="#cccccc"
            onValueChange={handleToggleAnnounceScreen}
            value={localSettings.announceScreen}
            style={styles.switch}
          />
        </View>
          <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>自动播报AI医生回复</Text>
            <Text style={styles.settingDescription}>
              开启后，在对话页面会自动播报AI医生的回复
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#cccccc", true: "#81b0ff" }}
            thumbColor={localSettings.autoReadAIResponse ? "#2196F3" : "#f4f3f4"}
            ios_backgroundColor="#cccccc"
            onValueChange={handleToggleAutoReadAIResponse}
            value={localSettings.autoReadAIResponse || false}
            style={styles.switch}
          />
        </View>
      </View>
      
      {localSettings.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>语音参数调节</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>语速调节</Text>
            <Text style={styles.sliderValue}>
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
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#2196F3"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>慢</Text>
              <Text style={styles.sliderMaxLabel}>快</Text>
            </View>
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>音量调节</Text>
            <Text style={styles.sliderValue}>
              {getVolumeLabel(localSettings.volume)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              step={0.1}
              value={localSettings.volume}
              onValueChange={handleVolumeChange}
              onSlidingComplete={handleVolumeChangeComplete}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#2196F3"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>小</Text>
              <Text style={styles.sliderMaxLabel}>大</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.previewButton,
              isSpeaking ? styles.previewButtonActive : null
            ]}
            onPress={handlePreview}
          >
            <Icon 
              name={isSpeaking ? "stop" : "play-arrow"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.previewButtonText}>
              {isSpeaking ? "停止预览" : "试听效果"}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.examplesTitle}>实用场景试听</Text>
          <View style={styles.examplesContainer}>
            {previewExamples.map((example, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.exampleButton}
                onPress={() => !isSpeaking && speak(example.text)}
              >
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <Icon name="play-circle-outline" size={24} color="#2196F3" />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.infoBox}>
            <Icon name="info" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
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
    backgroundColor: '#fff',
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
    color: '#333',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
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
    color: '#333',
    marginBottom: 4,
  },
  sliderValue: {
    fontSize: 16,
    color: '#2196F3',
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
    color: '#666',
    fontSize: 14,
  },
  sliderMaxLabel: {
    color: '#666',
    fontSize: 14,
  },
  previewButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  previewButtonActive: {
    backgroundColor: '#f44336',
  },
  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  }
});
