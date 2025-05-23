import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Button, Dialog, Portal, ProgressBar, Text } from 'react-native-paper';
import { ReminderCard } from '@/components/atoms/ReminderCard';
import { useTreatmentPlan } from '@/hooks/domain/treatment/useTreatmentPlan';
import { TTSPageAdapter } from '@/components/molecules/TTSPageAdapter';

export function TreatmentPlanScreen() {  const { colors, fonts, layout, gutters } = useTheme();
  const {
    plans,
    progress,
    visible,
    handleCardPress,
    handleUpload,
    handleDismissDialog,
    rewardEggs, // 虽然未使用，但保留以备将来使用
  } = useTreatmentPlan();

  // 准备用于朗读的屏幕内容
  const screenContent = `治疗计划页面，当前进度${progress}%，有${plans.length}项用药任务需要完成。`;

  return (
    <SafeScreen>
      <View style={[layout.flex_1]}>
      
        <View style={[gutters.padding_16]}>          <Text style={[fonts.body1, { marginBottom: 8 }]}>当前进度：{progress}%</Text>
          <ProgressBar
            progress={progress / 100}
            color={colors.primary}
            style={[{ height: 8, borderRadius: 4, marginBottom: 8 }]}
          />
          <Text style={[fonts.caption, { marginBottom: 8, textAlign: 'right' }]}>
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

        {/* 添加页面适配器 */}
        <TTSPageAdapter screenName="治疗计划" screenContent={screenContent} />
        
        {/* 完成或上传对话框 */}
        <Portal>
          <Dialog visible={visible} onDismiss={handleDismissDialog}>
            <Dialog.Title>完成任务</Dialog.Title>
            <Dialog.Content>
              <Text style={fonts.body1}>您已完成当前服药任务，请选择：</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleUpload}>上传照片</Button>
              <Button mode="contained" onPress={handleDismissDialog}>完成记录</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeScreen>
  );
}