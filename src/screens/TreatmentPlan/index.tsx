import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { ReminderCard } from '@/components/atoms/ReminderCard';
import { ProgressFace } from '@/components/atoms/ProgressFace';
import { useTreatmentPlan } from '@/hooks/domain/treatment/useTreatmentPlan';
import { TTSPageAdapter } from '@/components/molecules/TTSPageAdapter';

export function TreatmentPlanScreen() {
  const { fonts, layout, gutters } = useTheme();
  const {
    plans,
    progress,
    visible,
    handleCardPress,
    handleUpload,
    handleDismissDialog,
    // rewardEggs, // 保留以备将来使用，暂时注释避免 lint 警告
  } = useTreatmentPlan();

  // 准备用于朗读的屏幕内容
  const screenContent = `治疗计划页面，当前进度${progress}%，有${plans.length}项用药任务需要完成。`;

  return (
    <SafeScreen>
      <View style={[layout.flex_1]}>
        <View style={[gutters.padding_32]}>          
          <View style={[layout.itemsCenter, { marginBottom: 16 }]}>
            <ProgressFace progress={progress} size={160} />
          </View>
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
              <Button mode="contained" onPress={handleDismissDialog}>取消</Button>
              <Button onPress={handleUpload}>上传照片</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeScreen>
  );
}