import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Button, Card, Dialog, Portal, ProgressBar, Text, useTheme as usePaperTheme } from 'react-native-paper';
import { ReminderCard } from '@/components/atoms/ReminderCard';

interface MedicationPlan {
  id: string;
  time: string;
  medicine: string;
  dosage: string;
  deadline: string;
  completed: boolean;
}

const treatmentPlans: MedicationPlan[] = [
  {
    id: '1',
    time: '早上 8:00',
    medicine: '降压药',
    dosage: '1片',
    deadline: '08:30',
    completed: false,
  },
  {
    id: '2',
    time: '中午 12:00',
    medicine: '维生素',
    dosage: '1粒',
    deadline: '12:30',
    completed: true,
  },
  {
    id: '3',
    time: '晚上 19:00',
    medicine: '降压药',
    dosage: '1片',
    deadline: '19:30',
    completed: false,
  },
];

export function TreatmentPlanScreen() {
  const { colors, fonts, components, layout, gutters } = useTheme();
  const paperTheme = usePaperTheme();
  const [plans, setPlans] = useState<MedicationPlan[]>(treatmentPlans);
  const [progress, setProgress] = useState(50);
  const [visible, setVisible] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);

  const handleCardPress = (index: number) => {
    setSelectedPlanIndex(index);
    setVisible(true);
  };

  const handleUpload = () => {
    if (selectedPlanIndex === null) return;

    setPlans(prevPlans => {
      const newPlans = [...prevPlans];
      newPlans[selectedPlanIndex] = {
        ...newPlans[selectedPlanIndex],
        completed: true,
      };
      return newPlans;
    });

    setProgress(prev => Math.min(prev + 10, 100));
    setVisible(false);
  };

  const rewardEggs = Math.floor(progress / 20); // 每20%进度可以兑换一个鸡蛋

  return (
    <SafeScreen>
      <View style={[layout.flex_1]}>
      
        <View style={[gutters.padding_16]}>
          <Text style={[fonts.body1, gutters.marginBottom_8]}>当前进度：{progress}%</Text>
          <ProgressBar
            progress={progress / 100}
            color={colors.primary}
            style={[{ height: 8, borderRadius: 4 }, gutters.marginBottom_8]}
          />
          <Text style={[fonts.caption,  gutters.marginBottom_8, layout.alignRight]}>
            距离下次奖励还差 {20 - (progress % 20)}%，完成可获得鸡蛋5个
          </Text>
        </View>

        <ScrollView style={layout.flex_1}>
          {plans.map((plan, index) => (
            <ReminderCard
              key={plan.id}
              title={plan.time}
              time={`截止时间：${plan.deadline}`}
              description={`服用${plan.medicine} ${plan.dosage}`}
              completed={plan.completed}
              onPress={() => !plan.completed && handleCardPress(index)}
              style={gutters.marginHorizontal_16}
            />
          ))}
        </ScrollView>

        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>完成用药打卡</Dialog.Title>
            <Dialog.Content>
              <Text style={fonts.body1}>请上传吃药照片以完成打卡</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>取消</Button>
              <Button
                mode="contained"
                onPress={handleUpload}
                style={{ backgroundColor: colors.primary }}
              >
                上传照片并完成
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeScreen>
  );
}