import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { MMKV } from 'react-native-mmkv';
import { usePermissions } from '@/hooks/usePermissions';
import { useTTS } from '@/hooks/useTTS';
import { PlayIcon, PauseIcon } from '@/components/atoms/Icons';
import { PlayProgressBar } from '@/components/atoms/PlayProgressBar';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
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
  const { colors, components, fonts, layout, gutters } = useTheme();
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
  
  const scrollViewRef = useRef<FlatList>(null);
  const isMounted = useRef(true);
  const voiceInitialized = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const setupVoiceRecognition = async () => {
      if (voiceInitialized.current) return;
      
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
        
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          throw new Error('语音识别不可用');
        }

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
        components.card,
        item.isUser ? {
          alignSelf: 'flex-end',
          backgroundColor: colors.primaryLight,
          borderBottomRightRadius: 4,
        } : {
          alignSelf: 'flex-start',
          backgroundColor: colors.white,
          borderBottomLeftRadius: 4,
        },
        { maxWidth: '80%' }
      ]}
      onPress={() => togglePlayMessage(item)}
      disabled={item.isUser}
    >
      <Text style={[fonts.body1, { color: colors.gray800 }]}>{item.text}</Text>
      {!item.isUser && (
        <View style={[layout.row, layout.itemsCenter, gutters.marginTop_8]}>
          <View style={[layout.flex_1, gutters.marginRight_8]}>
            <PlayProgressBar 
              progress={item.isPlaying ? progress : null}
              color={colors.gray400}
              height={1.5}
            />
          </View>
          <Text style={[fonts.caption, { color: colors.gray500 }]}>{item.timestamp}</Text>
          <View style={[layout.justifyCenter, layout.itemsCenter, gutters.marginLeft_8]}>
            {item.isPlaying ? (
              <PauseIcon size={16} color={colors.gray500} />
            ) : (
              <PlayIcon size={16} color={colors.gray500} />
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={[layout.flex_1, { backgroundColor: colors.gray50 }]}>
        <FlatList
          data={state.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={layout.flex_1}
          contentContainerStyle={gutters.padding_16}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {state.isThinking && (
          <View style={[
            components.card,
            gutters.margin_16,
            { alignSelf: 'flex-start', backgroundColor: colors.gray100 }
          ]}>
            <Text style={[fonts.body2, { color: colors.gray600 }]}>正在思考...</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            components.buttonPrimary,
            gutters.margin_16,
            state.isRecording && { backgroundColor: colors.error }
          ]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <Text style={[fonts.button, { color: colors.white }]}>
            {state.isRecording ? '正在录音...' : '按住说话'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}