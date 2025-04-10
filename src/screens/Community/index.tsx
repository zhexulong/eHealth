import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
import { Ripple } from '@/components/atoms';

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
  const { colors, fonts, components, layout, gutters } = useTheme();
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
      <View style={[
        components.card,
        gutters.marginBottom_12,
        item.completed && { opacity: 0.7, backgroundColor: colors.gray100 }
      ]}>
        <View style={[layout.col, { gap: 8 }]}>
          <View>
            <Text style={[
              fonts.h5,
              { color: colors.primary },
              item.completed && { color: colors.gray500, textDecorationLine: 'line-through' }
            ]}>
              {item.type}提醒
            </Text>
            <Text style={[
              fonts.body2,
              { color: colors.gray600 },
              item.completed && { color: colors.gray500, textDecorationLine: 'line-through' }
            ]}>
              {item.time}
            </Text>
          </View>
          <Text style={[
            fonts.body1,
            { color: colors.gray800 },
            item.completed && { color: colors.gray500, textDecorationLine: 'line-through' }
          ]}>
            提醒{item.user}{item.time}{item.type}
          </Text>
        </View>
        {item.completed && (
          <View style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: colors.gray400
          }} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={[layout.flex_1, { backgroundColor: colors.gray50 }]}>
        <View style={[
          gutters.padding_16,
          { borderBottomWidth: 1, borderBottomColor: colors.gray200 }
        ]}>
          <Text style={[fonts.h5, gutters.marginBottom_16]}>
            邀请家属/病友
          </Text>
          <View style={[layout.row, layout.itemsCenter]}>
            <TextInput
              style={[
                components.input,
                layout.flex_1,
                gutters.marginRight_12
              ]}
              placeholder="请输入手机号"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={11}
              placeholderTextColor={colors.gray500}
            />
            <Ripple
              style={components.buttonPrimary}
              onPress={handleInvite}
            >
              <Text style={[fonts.size_16, fonts.medium, { color: colors.white }]}>邀请</Text>
            </Ripple>
          </View>
        </View>

        <View style={[layout.flex_1, gutters.paddingTop_16]}>
          <Text style={[
            fonts.h5,
            gutters.marginBottom_16,
            gutters.marginLeft_16
          ]}>
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