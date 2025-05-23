import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { GiftedChat as RNGiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { IconButton, Surface, useTheme as usePaperTheme, Chip, Button } from 'react-native-paper';
import { createAgoraRtcEngine } from 'react-native-agora';
import { usePermissions } from '@/hooks/usePermissions';
import { AGORA_CONFIG } from '@/config/agora';
import { useTTS } from '@/hooks/useTTS';
import { TTSPageAdapter } from '@/components/molecules/TTSPageAdapter';

const medicalQuestions = [
  "为什么我需要长期吃降压药？",
  "血压正常后可以停药吗？",
  "血压忽高忽低是怎么回事？",
  "忘记服药怎么办？",
];

const medicalAnswers = [
  "高血压属于慢性疾病，通常需要终身管理。药物治疗在控制血压方面起着关键作用，能有效降低心脑血管并发症的风险，像中风、心梗等。从医学研究来看，规律服药的患者比不规律服药的患者发生心脑血管并发症的概率低很多。例如，有一位 60 岁的患者老张，他之前一直按时服用降压药，血压控制得很稳定。但有一段时间，他觉得自己身体没什么不适，就自行停了药。结果没过多久，血压急剧升高，引发了轻微中风，经过紧急治疗才脱离危险。所以，擅自停药会导致血压反弹，大大增加器官损害的风险。",
  "一般情况下，不建议高血压患者自行停药。多数患者都需要长期维持治疗，目前血压正常往往是药物控制的结果。一旦停药，血压很可能再次升高。我们做出这个判断是基于大量的临床案例。比如，有一位 55 岁的患者老李，他在血压控制正常后，自行停了药。起初血压还正常，但几周后血压又开始波动，不得不重新开始服药。如果患者觉得自己的情况有变化，需要调整治疗方案，必须由医生进行全面评估后，根据具体情况逐步减量。",
  "血压波动可能由多种因素引起，常见的有情绪波动、睡眠不足、药物依从性差或者是继发性高血压。我们是结合了医学知识和大量临床案例来判断这些原因的。例如，有一位 45 岁的患者小王，最近工作压力大，情绪一直很焦虑，血压也随之波动。还有一位 50 岁的患者小赵，他晚上经常熬夜，睡眠不足，血压也出现了不稳定的情况。建议您固定时间测量血压，详细记录血压值以及伴随的症状；保持规律的生活作息；严格按照医嘱服药。如果血压持续异常，一定要及时咨询医生。",
  "如果漏服了降压药，处理方法要根据不同情况来定。这是依据药物的药代动力学和临床实践总结出来的。如果当天想起漏服了药物，应该立即补服，但注意不要加倍剂量，以免血压降得过低。例如，有一位患者小陈，有一次他早上漏服了药，中午想起来后就立即补服了，血压也没有出现太大波动。如果是第二天才想起，那就跳过漏服的剂量，按原计划继续服用。要是经常漏服药物，建议设置提醒，比如使用手机闹钟或者专门的健康管理 APP 来提醒自己按时服药，这样能更好地保证治疗效果。"
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
  const { speak, stop, isSpeaking, settings } = useTTS();
  const [lastBotMessage, setLastBotMessage] = useState<string | null>(null);

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

  // 自动播报最新医生消息
  useEffect(() => {
    if (lastBotMessage && settings.enabled && (settings.autoPlay || settings.autoReadAIResponse)) {
      // 确保之前的朗读已停止
      stop();
      // 添加短暂延迟，确保UI渲染完成
      setTimeout(() => {
        // 自动播报医生回复
        speak(lastBotMessage);
      }, 300);
    }
  }, [lastBotMessage, settings.enabled, settings.autoPlay, settings.autoReadAIResponse, speak, stop]);

  // 处理朗读最新回复
  const handleReadLatestReply = () => {
    if (isSpeaking) {
      stop();
    } else {
      if (lastBotMessage) {
        speak(lastBotMessage);
      } else {
        speak("现在还没有消息哦，你有什么需要可以向AI医生求助");
      }
    }
  };

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
    setTimeout(() => {
      onSend([botMessage]);
      setLastBotMessage(answer);
    }, 1000);
  };

  // 用于朗读的当前对话内容
  const getCurrentChatContent = useCallback(() => {
    if (messages.length === 0) return "当前没有对话内容";
    
    // 最多朗读最近的5条消息
    const recentMessages = messages.slice(0, 5).reverse();
    return recentMessages.map(msg => {
      const speaker = msg.user._id === 1 ? "您" : "AI医生";
      return `${speaker}说: ${msg.text}`;
    }).join('. ');
  }, [messages]);

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
          <View style={styles.controlsContainer}>
            <IconButton
              mode="contained"
              size={35}
              style={[styles.voiceButton, isRecording && styles.recording]}
              onPressIn={handleVoiceStart}
              onPressOut={handleVoiceEnd}
              icon="microphone"
              theme={{ colors: { primary: paperTheme.colors.primary } }}
            />
            {settings.enabled && (
              <Button
                mode="contained"
                onPress={handleReadLatestReply}
                style={[styles.ttsButton, isSpeaking && styles.ttsSpeakingButton]}
                icon={isSpeaking ? "stop" : "text-to-speech"}
              >
                {isSpeaking ? "停止朗读" : "朗读回复"}
              </Button>
            )}
          </View>
        </Surface>

        {/* 添加页面适配器，支持页面播报 */}
        <TTSPageAdapter 
          screenName="对话"
          screenContent={getCurrentChatContent()}
          importantMessage={lastBotMessage || undefined}
        />
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
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ttsButton: {
    marginLeft: 16,
    borderRadius: 30,
    padding: 2,
  },
  ttsSpeakingButton: {
    backgroundColor: '#f44336',
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
    backgroundColor: '#f44336',
  },
})