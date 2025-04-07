import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat as RNGiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Button, Text } from 'react-native-paper';

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
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={[styles.voiceButton, isRecording && styles.recording]}
            onPressIn={handleVoiceStart}
            onPressOut={handleVoiceEnd}
            icon="microphone"
            labelStyle={styles.buttonText}
          >
            按住说话
          </Button>
        </View>
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
    paddingBottom: 100, // 为底部按钮预留空间
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#E3F2FD', // 半透明背景
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  voiceButton: {
    width: 180,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  recording: {
    backgroundColor: '#63b5f6',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
})