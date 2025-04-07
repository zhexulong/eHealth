import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme';

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
  const { colors } = useTheme();
  const [points, setPoints] = useState(150); // 用户当前积分

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
      // TODO: 处理兑换逻辑
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>病历说明</Text>
        <View style={styles.medicalCard}>
          <Text style={styles.medicalTitle}>基本信息</Text>
          <Text style={styles.medicalText}>姓名：张三</Text>
          <Text style={styles.medicalText}>年龄：45岁</Text>
          <Text style={styles.medicalText}>病史：高血压 II 期</Text>
          <Text style={styles.medicalText}>用药情况：每日服用降压药</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>荣誉勋章</Text>
        <View style={styles.badgesContainer}>
          {badges.map(badge => (
            <View key={badge.id} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>积分兑换</Text>
        <Text style={styles.pointsText}>当前积分：{points}</Text>
        <View style={styles.rewardsContainer}>
          {rewardItems.map(item => (
            <View key={item.id} style={styles.rewardCard}>
              <Text style={styles.rewardName}>{item.name}</Text>
              <Text style={styles.rewardPoints}>{item.points} 积分</Text>
              <Text style={styles.rewardStock}>库存：{item.stock}</Text>
              <TouchableOpacity
                style={[
                  styles.exchangeButton,
                  {
                    backgroundColor:
                      points >= item.points && item.stock > 0 ? colors.purple500 : '#ccc',
                  },
                ]}
                onPress={() => handleExchange(item)}
                disabled={points < item.points || item.stock <= 0}
              >
                <Text style={styles.exchangeButtonText}>兑换</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  medicalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  medicalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  medicalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  rewardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rewardStock: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  exchangeButton: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  exchangeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});