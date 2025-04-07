import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
import { Card } from 'react-native-paper';

interface Reminder {
  id: string;
  type: string;
  user: string;
  time: string;
  completed?: boolean;
}

const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    type: '用药',
    user: '张妈妈',
    time: '每天 08:00',
  },
  {
    id: '2',
    type: '复诊',
    user: '王叔叔',
    time: '2025-04-15 09:30',
  },
  {
    id: '3',
    type: '运动',
    user: '李奶奶',
    time: '每天 15:00',
  },
];

export function CommunityScreen() {
  const { colors, fonts, gutters, layout } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);

  const handleInvite = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    Alert.alert('成功', '邀请已发送');
    setPhoneNumber('');
  };

  const handleReminderPress = (id: string) => {
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <TouchableOpacity onPress={() => handleReminderPress(item.id)}>
      <Card style={[styles.card, item.completed && styles.completedCard]}>
        <Card.Content>
          <View style={styles.reminderInfo}>
            <View>
              <Text style={[styles.titleText, item.completed && styles.completedText]}>
                {item.type}提醒
              </Text>
              <Text style={[styles.timeText, item.completed && styles.completedText]}>
                {item.time}
              </Text>
            </View>
            <Text style={[styles.contentText, item.completed && styles.completedText]}>
              提醒{item.user}{item.time}{item.type}
            </Text>
          </View>
          {item.completed && (
            <View style={styles.completedLine} />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, layout.fullHeight]}>
        <View style={[styles.inviteSection, gutters.padding_16]}>
          <Text style={[fonts.size_16, fonts.bold, gutters.marginBottom_16]}>
            邀请家属/病友
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />
            <TouchableOpacity 
              style={[styles.inviteButton, { backgroundColor: colors.purple500 }]}
              onPress={handleInvite}
            >
              <Text style={styles.inviteButtonText}>邀请</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.remindersSection, layout.flex_1]}>
          <Text style={[fonts.size_16, fonts.bold, gutters.marginBottom_16, gutters.marginLeft_16]}>
            协同提醒
          </Text>
          <FlatList
            data={reminders}
            renderItem={renderReminderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={gutters.padding_16}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  inviteSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    fontSize: 14,
  },
  inviteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  remindersSection: {
    paddingTop: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  reminderInfo: {
    flexDirection: 'column',
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2196F3',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  completedLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#999',
  },
});