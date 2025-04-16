import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat as RNGiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { IconButton, Text, Surface, useTheme as usePaperTheme } from 'react-native-paper';

const medicalQuestions = [
  "为什么我需要长期吃降压药？",
  "血压正常后可以停药吗？",
  "血压忽高忽低是怎么回事？",
  "忘记服药怎么办？",
];

const medicalAnswers = [
  "高血压是慢性疾病，需终身管理。药物通过控制血压，降低心脑血管并发症风险（如中风、心梗）。擅自停药会导致血压反弹，增加器官损害风险。",
  "不建议。多数患者需长期维持治疗。血压正常是药物控制的结果，停药后可能再次升高。如需调整方案，需由医生评估后逐步减量。",
  "可能与情绪波动、睡眠不足、药物依从性差或继发性高血压有关。建议：固定时间测量血压‘记录血压值及症状；保持规律生活；按医嘱服药。如持续异常，需咨询医生。",
  "当天想起：立即补服，但不要加倍剂量；第二天想起：跳过漏服的剂量，按原计划服用；若经常漏服，可设置提醒。",
];

export function ChatScreen() {
  const { layout } = useTheme();
  const paperTheme = usePaperTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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
  chatContainer: {
    flex: 1,
    paddingBottom: 120, // 为底部按钮预留空间
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