import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Text, Card, Button } from 'react-native-paper';
import { MedicalCard } from '@/components/atoms/MedicalCard/MedicalCard';
import { AchievementBadge } from '@/components/atoms/AchievementBadge';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';

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

export function ProfileScreen() {
  const { colors, fonts, components, layout, gutters } = useTheme();
  const [points, setPoints] = useState(150);

  const handleExchange = (item: RewardItem) => {
    if (points >= item.points && item.stock > 0) {
      setPoints(points - item.points);
    }
  };

  return (
    <SafeScreen>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={gutters.padding_16}>
          <Text variant="headlineMedium" style={gutters.marginBottom_16}>病历说明</Text>
          <MedicalCard
            title="基本信息"
            description={`姓名：张三\n年龄：45岁\n病史：高血压 II 期\n用药情况：每日服用降压药`}
            status="normal"
            style={gutters.marginBottom_16}
          />
        </View>

        <View style={gutters.padding_16}>
          <Text variant="headlineMedium" style={gutters.marginBottom_16}>荣誉勋章</Text>
          <View style={[layout.row, layout.wrap, { gap: 16 }]}>
            {badges.map(badge => (
              <AchievementBadge
                key={badge.id}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
              />
            ))}
          </View>
        </View>

        <View style={gutters.padding_16}>
          <Text variant="headlineMedium" style={gutters.marginBottom_16}>积分兑换</Text>
          <Text variant="titleLarge" style={gutters.marginBottom_16}>当前积分：{points}</Text>
          <View style={[layout.row, layout.wrap, { gap: 16 }]}>
            {rewardItems.map(item => (
              <Card
                key={item.id}
                style={{
                  width: '47%',
                }}
              >
                <Card.Content>
                  <Text variant="titleMedium" style={gutters.marginBottom_4}>{item.name}</Text>
                  <Text variant="bodyMedium" style={gutters.marginBottom_4}>
                    {item.points} 积分
                  </Text>
                  <Text variant="bodySmall" style={gutters.marginBottom_8}>
                    库存：{item.stock}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => handleExchange(item)}
                    disabled={points < item.points || item.stock === 0}
                  >
                    {points >= item.points && item.stock > 0 ? '兑换' : '积分不足'}
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}