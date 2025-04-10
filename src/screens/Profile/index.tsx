import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
import { MedicalCard } from '@/components/atoms/MedicalCard/MedicalCard';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RewardItem {
  id: string;
  name: string;
  points: number;
  stock: number;
}

export function ProfileScreen() {
  const { colors, fonts, components, layout, gutters } = useTheme();
  const [points, setPoints] = useState(150);

  const badges: Badge[] = [
    { id: '1', title: '服药达人', description: '连续服药30天', icon: '🏆' },
    { id: '2', title: '准时达人', description: '按时服药7天', icon: '⭐' },
    { id: '3', title: '健康达人', description: '完成所有检查', icon: '🌟' },
  ];

  const rewardItems: RewardItem[] = [
    { id: '1', name: '鸡蛋', points: 50, stock: 10 },
    { id: '2', name: '水果', points: 80, stock: 5 },
    { id: '3', name: '营养品', points: 200, stock: 3 },
  ];

  const handleExchange = (item: RewardItem) => {
    if (points >= item.points && item.stock > 0) {
      setPoints(points - item.points);
    }
  };

  return (
    <SafeScreen>
      <ScrollView style={{ backgroundColor: colors.gray50 }}>
        <View style={gutters.padding_16}>
          <Text style={[fonts.h2, gutters.marginBottom_16]}>病历说明</Text>
          <View style={components.card}>
            <Text style={[fonts.h4, gutters.marginBottom_12]}>基本信息</Text>
            <Text style={[fonts.body1, gutters.marginBottom_8]}>姓名：张三</Text>
            <Text style={[fonts.body1, gutters.marginBottom_8]}>年龄：45岁</Text>
            <Text style={[fonts.body1, gutters.marginBottom_8]}>病史：高血压 II 期</Text>
            <Text style={[fonts.body1]}>用药情况：每日服用降压药</Text>
          </View>
        </View>

        <View style={gutters.padding_16}>
          <Text style={[fonts.h2, gutters.marginBottom_16]}>荣誉勋章</Text>
          <View style={[layout.row, layout.wrap, { gap: 16 }]}>
            {badges.map(badge => (
              <View
                key={badge.id}
                style={[
                  components.card,
                  {
                    width: '47%',
                    alignItems: 'center'
                  }
                ]}
              >
                <Text style={[fonts.h1, gutters.marginBottom_8]}>{badge.icon}</Text>
                <Text style={[fonts.h5, gutters.marginBottom_4]}>{badge.title}</Text>
                <Text style={[fonts.caption, { color: colors.gray600, textAlign: 'center' }]}>
                  {badge.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={gutters.padding_16}>
          <Text style={[fonts.h2, gutters.marginBottom_16]}>积分兑换</Text>
          <Text style={[fonts.h4, gutters.marginBottom_16]}>当前积分：{points}</Text>
          <View style={[layout.row, layout.wrap, { gap: 16 }]}>
            {rewardItems.map(item => (
              <View
                key={item.id}
                style={[
                  components.card,
                  {
                    width: '47%',
                  }
                ]}
              >
                <Text style={[fonts.h5, gutters.marginBottom_4]}>{item.name}</Text>
                <Text style={[fonts.body2, { color: colors.gray600 }, gutters.marginBottom_4]}>
                  {item.points} 积分
                </Text>
                <Text style={[fonts.caption, { color: colors.gray500 }, gutters.marginBottom_8]}>
                  库存：{item.stock}
                </Text>
                <TouchableOpacity
                  style={[
                    components.buttonPrimary,
                    points < item.points || item.stock <= 0 ? { backgroundColor: colors.gray400 } : {}
                  ]}
                  onPress={() => handleExchange(item)}
                  disabled={points < item.points || item.stock <= 0}
                >
                  <Text style={[fonts.button, { color: colors.white }]}>兑换</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}