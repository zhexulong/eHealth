import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GiftedChat as RNGiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { IconButton, Surface, useTheme as usePaperTheme, Chip } from 'react-native-paper';
import { createAgoraRtcEngine } from 'react-native-agora';
import { usePermissions } from '@/hooks/usePermissions';
import { AGORA_CONFIG } from '@/config/agora';

const medicalQuestions = [
  "为什么我需要长期吃降压药？",
  "血压正常后可以停药吗？",
  "血压忽高忽低是怎么回事？",
  "忘记服药怎么办？",
];

const medicalAnswers = [
  "高血压是慢性疾病，需终身管理。药物通过控制血压，降低心脑血管并发症风险（如中风、心梗）。擅自停药会导致血压反弹，增加器官损害风险。",
  "不建议。多数患者需长期维持治疗。血压正常是药物控制的结果，停药后可能再次升高。如需调整方案，需由医生评估后逐步减量。",
  "可能与情绪波动、睡眠不足、药物依从性差或继发性高血压有关。建议：固定时间测量血压'记录血压值及症状；保持规律生活；按医嘱服药。如持续异常，需咨询医生。",
  "当天想起：立即补服，但不要加倍剂量；第二天想起：跳过漏服的剂量，按原计划服用；若经常漏服，可设置提醒。",
];

export function ChatScreen() {
  const { layout } = useTheme();
  const paperTheme = usePaperTheme();
  const hasPermissions = usePermissions();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isInChannel, setIsInChannel] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [engine, setEngine] = useState<any>(null);

  // 初始化 Agora 引擎
  useEffect(() => {
    if (!hasPermissions) return;

    const initEngine = async () => {
      try {
        const agoraEngine = createAgoraRtcEngine();
        // 初始化配置
        agoraEngine.initialize({
          appId: AGORA_CONFIG.appId,
          channelProfile: 1, // LIVE_BROADCASTING
          // 音频场景配置
          audioScenario: 3, // DEFAULT
        });
        
        // 配置事件监听器
        agoraEngine.addListener('onError', (err) => {
          console.error('Agora Error:', err);
          if (err === 109) {
            Alert.alert('错误', 'Token已过期，请重新获取Token');
          } else {
            Alert.alert('错误', '语音通话发生错误，请重试');
          }
        });

        agoraEngine.addListener('onJoinChannelSuccess', (connection, elapsed) => {
          console.log('成功加入频道:', connection.channelId);
          setIsInChannel(true);
        });

        agoraEngine.addListener('onUserJoined', (connection, remoteUid, elapsed) => {
          console.log('远程用户加入:', remoteUid);
          setRemoteUsers(prev => [...prev, remoteUid]);
        });

        agoraEngine.addListener('onUserOffline', (connection, remoteUid, reason) => {
          console.log('远程用户离开:', remoteUid, '原因:', reason);
          setRemoteUsers(prev => prev.filter(id => id !== remoteUid));
        });

        agoraEngine.addListener('onConnectionStateChanged', (state, reason) => {
          console.log('连接状态变更:', state, '原因:', reason);
          switch (state) {
            case 1: // DISCONNECTED
              Alert.alert('连接已断开', '请检查网络连接后重试');
              break;
            case 2: // CONNECTING
              console.log('正在连接中...');
              break;
            case 3: // CONNECTED
              console.log('连接成功');
              break;
            case 4: // RECONNECTING
              Alert.alert('提示', '网络不稳定，正在重新连接...');
              break;
            case 5: // FAILED
              Alert.alert('错误', '连接失败，请检查网络设置');
              break;
          }
        });

        agoraEngine.addListener('onTokenPrivilegeWillExpire', () => {
          Alert.alert('提示', 'Token即将过期，请准备更新Token');
          // 这里可以添加获取新Token的逻辑
        });

        // 启用音频并设置配置
        agoraEngine.enableAudio();
        agoraEngine.setAudioProfile(0, 1); // SPEECH_STANDARD, CHATROOM
        agoraEngine.setDefaultAudioRouteToSpeakerphone(true);
        
        setEngine(agoraEngine);
      } catch (e) {
        console.error('初始化 Agora 引擎失败:', e);
        Alert.alert('错误', '初始化语音引擎失败，请重启应用后重试');
      }
    };

    initEngine();

    return () => {
      if (engine) {
        engine.leaveChannel();
        engine.release();
      }
    };
  }, [hasPermissions]);

  const joinChannel = async () => {
    if (!hasPermissions) {
      Alert.alert('提示', '请先授予麦克风权限');
      return;
    }

    if (!engine) {
      Alert.alert('错误', '语音引擎未初始化');
      return;
    }

    try {
      // 加入频道前启用音频
      engine.enableAudio();
      engine.setAudioProfile(0, 1); // SPEECH_STANDARD, CHATROOM
      engine.setDefaultAudioRouteToSpeakerphone(true);

      await engine.joinChannel(AGORA_CONFIG.token, AGORA_CONFIG.channelName, 0);
      console.log('正在加入频道...');
    } catch (e) {
      console.error('加入频道失败:', e);
      Alert.alert('错误', '加入频道失败，请检查网络连接');
    }
  };

  const leaveChannel = async () => {
    if (!engine) {
      console.warn('语音引擎未初始化');
      return;
    }

    try {
      await engine.leaveChannel();
      setIsInChannel(false);
      setRemoteUsers([]);
      console.log('已离开频道');
    } catch (e) {
      console.error('离开频道失败:', e);
      Alert.alert('错误', '离开频道失败，请稍后重试');
    }
  };

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      RNGiftedChat.append(previousMessages, newMessages),
    );
  }, []);

  const handleVoiceStart = () => {
    setIsRecording(true);
  };

  const handleVoiceEnd = () => {
    setIsRecording(false);
    
    // 随机选择问题和答案
    const questionIndex = Math.floor(Math.random() * medicalQuestions.length);
    const question = medicalQuestions[questionIndex];
    const answer = medicalAnswers[questionIndex];
    
    // 添加用户问题
    const userMessage: IMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: question,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };
    
    // 添加AI回答
    const botMessage: IMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: answer,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'AI医生',
      },
    };
    
    onSend([userMessage]);
    setTimeout(() => onSend([botMessage]), 1000);
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, styles.container]}>
        <Surface style={styles.header} elevation={2}>
          <IconButton
            mode="contained"
            icon={isInChannel ? "phone-off" : "phone"}
            onPress={isInChannel ? leaveChannel : joinChannel}
            style={[styles.channelButton, isInChannel && styles.leaveButton]}
          />
          <View style={styles.usersContainer}>
            {remoteUsers.map(uid => (
              <Chip key={uid} style={styles.userChip}>
                用户 {uid}
              </Chip>
            ))}
          </View>
        </Surface>
        <View style={styles.chatContainer}>
          <RNGiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: 1,
            }}
            renderInputToolbar={() => null}
          />
        </View>
        <Surface style={styles.buttonContainer} elevation={4}>
          <IconButton
            mode="contained"
            size={35}
            style={[styles.voiceButton, isRecording && styles.recording]}
            onPressIn={handleVoiceStart}
            onPressOut={handleVoiceEnd}
            icon="microphone"
            theme={{ colors: { primary: paperTheme.colors.primary } }}
          />
        </Surface>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  channelButton: {
    marginRight: 16,
    backgroundColor: '#4CAF50',
  },
  leaveButton: {
    backgroundColor: '#f44336',
  },
  usersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  userChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 120,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    flexDirection: 'row',
  },
  recording: {
    backgroundColor: '#63b5f6',
  },
})