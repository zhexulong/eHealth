import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { MMKV } from 'react-native-mmkv';
import { usePermissions } from '@/hooks/usePermissions';
import { useTTS } from '@/hooks/useTTS';
import { PlayIcon, PauseIcon } from '@/components/atoms/Icons';
import { PlayProgressBar } from '@/components/atoms/PlayProgressBar';
import type { Message, ChatState } from './types';

const storage = new MMKV();
const MESSAGES_STORAGE_KEY = '@chat_messages';
const MOCK_RESPONSES = [
  '这种症状建议及时就医检查。',
  '请保持良好的作息习惯。',
  '建议您多喝温水，注意保暖。',
  '这个情况需要进一步观察。',
  '建议您平时多运动，保持健康的生活方式。'
];

export function HomeScreen() {
  const hasPermission = usePermissions();
  const { speak, stop, isSpeaking, isInitialized, progress } = useTTS();
  const [state, setState] = useState<ChatState>(() => {
    const savedMessages = storage.getString(MESSAGES_STORAGE_KEY);
    return {
      messages: savedMessages ? JSON.parse(savedMessages) : [],
      isRecording: false,
      isThinking: false,
    };
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  const isMounted = useRef(true);
  const voiceInitialized = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const setupVoiceRecognition = async () => {
      if (voiceInitialized.current) return;
      
      try {
        // 等待语音引擎初始化
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
        
        // 检查语音识别可用性
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          throw new Error('语音识别不可用');
        }

        // 设置事件监听器
        Voice.onSpeechStart = () => {
          if (isMounted.current) {
            setState(prev => ({ ...prev, isRecording: true }));
          }
        };

        Voice.onSpeechEnd = () => {
          if (isMounted.current) {
            setState(prev => ({ ...prev, isRecording: false }));
          }
        };

        Voice.onSpeechResults = (e: any) => {
          if (e.value && e.value[0] && isMounted.current) {
            handleNewMessage(e.value[0], true);
          }
        };

        Voice.onSpeechError = (e: any) => {
          console.error('语音识别错误:', e);
          if (isMounted.current) {
            setState(prev => ({ ...prev, isRecording: false }));
          }
        };

        voiceInitialized.current = true;
      } catch (err) {
        console.error('语音识别初始化失败:', err);
        if (isMounted.current) {
          Alert.alert('提示', '语音识别初始化失败，请确保设备支持语音识别功能');
        }
      }
    };

    setupVoiceRecognition();

    return () => {
      isMounted.current = false;
      if (voiceInitialized.current) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.messages.length > 0) {
        storage.set(MESSAGES_STORAGE_KEY, JSON.stringify(state.messages));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state.messages]);

  useEffect(() => {
    if (isMounted.current) {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => ({
          ...msg,
          isPlaying: msg.isPlaying && isSpeaking,
        })),
      }));
    }
  }, [isSpeaking]);

  const handleNewMessage = useCallback((text: string, isUser: boolean) => {
    if (!isMounted.current) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString(),
      isUser,
      isPlaying: false,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    if (isUser && isMounted.current) {
      setState(prev => ({ ...prev, isThinking: true }));
      setTimeout(() => {
        if (isMounted.current) {
          const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
          handleNewMessage(response, false);
          setState(prev => ({ ...prev, isThinking: false }));
          if (isInitialized) {
            speak(response);
          }
        }
      }, 1500);
    }
  }, [speak, isInitialized]);

  const startRecording = useCallback(async () => {
    if (!hasPermission) {
      Alert.alert(
        '需要权限',
        '请允许必要的权限以使用语音功能（包括录音和存储权限）',
        [{ text: '确定' }]
      );
      return;
    }

    try {
      await Voice.start('zh-CN');
    } catch (e) {
      console.error(e);
      Alert.alert('错误', '启动语音识别失败，请重试');
    }
  }, [hasPermission]);

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const togglePlayMessage = useCallback(async (message: Message) => {
    if (message.isUser) return;
    
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => ({
        ...msg,
        isPlaying: msg.id === message.id ? !msg.isPlaying : false,
      })),
    }));

    if (message.isPlaying) {
      await stop();
    } else {
      await speak(message.text);
    }
  }, [speak, stop]);

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}
      onPress={() => togglePlayMessage(item)}
      disabled={item.isUser}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      {!item.isUser && (
        <View style={styles.messageFooter}>
          <View style={styles.progressContainer}>
            <PlayProgressBar 
              progress={item.isPlaying ? progress : null}
              color="#666666"
              height={1.5}
            />
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <View style={styles.iconContainer}>
            {item.isPlaying ? (
              <PauseIcon size={16} color="#666666" />
            ) : (
              <PlayIcon size={16} color="#666666" />
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {state.isThinking && (
        <View style={styles.thinkingContainer}>
          <Text style={styles.thinkingText}>正在思考...</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.recordButton,
          state.isRecording && styles.recordingButton
        ]}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <Text style={styles.recordButtonText}>
          {state.isRecording ? '正在录音...' : '按住说话'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  thinkingContainer: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    margin: 16,
    alignSelf: 'flex-start',
  },
  thinkingText: {
    color: '#666666',
  },
  recordButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  playIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    tintColor: '#666666',
  },
  iconContainer: {
    marginLeft: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
});