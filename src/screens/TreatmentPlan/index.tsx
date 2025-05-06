import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Button, Dialog, Portal, ProgressBar, Text, useTheme as usePaperTheme } from 'react-native-paper';
import { ReminderCard } from '@/components/atoms/ReminderCard';
import { useTreatmentPlan } from '@/hooks/domain/treatment/useTreatmentPlan';

export function TreatmentPlanScreen() {
  const { colors, fonts, layout, gutters } = useTheme();
  const paperTheme = usePaperTheme();
  const {
    plans,
    progress,
    visible,
    handleCardPress,
    handleUpload,
    handleDismissDialog,
    rewardEggs, // 虽然未使用，但保留以备将来使用
  } = useTreatmentPlan();

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
          <Dialog visible={visible} onDismiss={handleDismissDialog}>
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