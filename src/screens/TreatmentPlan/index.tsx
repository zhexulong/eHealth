import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Card, Text, ProgressBar, Portal, Dialog, Button } from 'react-native-paper';
import notifee from '@notifee/react-native';

interface MedicationPlan {
  time: string;
  medicine: string;
  dosage: string;
  completed?: boolean;
  deadline: string; // 格式 "HH:mm"
}

const treatmentPlans: MedicationPlan[] = [
  {
    time: '起床(10:00前)',
    medicine: '氨氯地平',
    dosage: '一粒',
    deadline: '10:00',
  },
  {
    time: '下午(下午16:00前)',
    medicine: '布洛芬',
    dosage: '两粒',
    deadline: '16:00',
  },
  {
    time: '睡前(晚上22:00前)',
    medicine: '维生素C',
    dosage: '一片',
    deadline: '22:00',
  },
];

async function onDisplayNotification(plan: MedicationPlan) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'medication',
    name: '用药提醒',
  });

  await notifee.displayNotification({
    title: '用药提醒',
    body: `请及时服用${plan.medicine} ${plan.dosage}，已经接近限制时间${plan.deadline}`,
    android: {
      channelId,
    },
  });
}

export function TreatmentPlanScreen() {
  const { layout, colors } = useTheme();
  const [plans, setPlans] = useState<MedicationPlan[]>(treatmentPlans);
  const [progress, setProgress] = useState(50);
  const [visible, setVisible] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkMedicationTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      plans.forEach((plan, index) => {
        if (!plan.completed) {
          const [deadlineHours, deadlineMinutes] = plan.deadline.split(':').map(Number);
          const deadlineDate = new Date();
          deadlineDate.setHours(deadlineHours, deadlineMinutes);

          // 如果距离截止时间不到60分钟且未完成，发送通知
          const timeDiff = deadlineDate.getTime() - now.getTime();
          if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
            onDisplayNotification(plan);
          }
        }
      });
    };

    // 每5分钟检查一次
    const interval = setInterval(checkMedicationTime, 5 * 60 * 1000);
    // 初始检查
    checkMedicationTime();

    return () => clearInterval(interval);
  }, [plans]);

  const handleCardPress = (index: number) => {
    setSelectedPlanIndex(index);
    setVisible(true);
  };

  const handleUpload = () => {
    if (selectedPlanIndex !== null) {
      const newPlans = [...plans];
      newPlans[selectedPlanIndex].completed = true;
      setPlans(newPlans);
      setProgress(prev => Math.min(prev + 1, 100));
    }
    setVisible(false);
  };

  const remainingProgress = 100 - progress;
  const rewardEggs = Math.floor(progress / 20); // 每20%进度可以兑换一个鸡蛋

  return (
    <SafeScreen>
      <View style={[layout.flex_1, styles.container]}>
        <Text style={styles.title}>治疗计划</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>当前进度：{progress}%</Text>
          <ProgressBar
            progress={progress / 100}
            color={colors.purple500}
            style={styles.progressBar}
          />
          <Text style={styles.rewardText}>
            距离下次奖励还差 {20 - (progress % 20)}%，完成可获得鸡蛋5个
          </Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {plans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(index)}>
              <Card style={[styles.card, plan.completed && styles.completedCard]}>
                <Card.Content>
                  <View style={styles.medicineInfo}>
                    <View>
                      <Text style={[styles.timeText, plan.completed && styles.completedText]}>
                        {plan.time}
                      </Text>
                      <Text style={[styles.medicineText, plan.completed && styles.completedText]}>
                        {plan.medicine}
                      </Text>
                    </View>
                    <Text style={[styles.dosageText, plan.completed && styles.completedText]}>
                      {plan.dosage}
                    </Text>
                  </View>
                  {plan.completed && (
                    <View style={styles.completedLine} />
                  )}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>完成用药打卡</Dialog.Title>
            <Dialog.Content>
              <Text>请上传吃药照片以完成打卡</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>取消</Button>
              <Button mode="contained" onPress={handleUpload}>
                上传照片并完成
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2196F3',
    marginBottom: 8,
  },
  medicineInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineText: {
    fontSize: 16,
    color: '#333',
  },
  dosageText: {
    fontSize: 14,
    color: '#666',
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
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
  rewardText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
});