import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notification';
import { calculateProgress } from './calculateProgress';

export interface MedicationPlan {
  id: string;
  time: string;
  medicine: string;
  dosage: string;
  deadline: string;
  completed: boolean;
}

const initialTreatmentPlans: MedicationPlan[] = [
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
    completed: false,
  },
  {
    id: '3',
    time: '晚上 20:00',
    medicine: '降压药',
    dosage: '1片',
    deadline: '20:00',
    completed: false,
  },
];

export function useTreatmentPlan() {
  const [plans, setPlans] = useState<MedicationPlan[]>(initialTreatmentPlans);
  const [progress, setProgress] = useState(() => calculateProgress(plans));
  const [visible, setVisible] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);

  // 更新进度的函数
  const updateProgress = useCallback(() => {
    setProgress(calculateProgress(plans));
  }, [plans]);

  useEffect(() => {
    // 初始化进度
    updateProgress();

    // 设置定时检查
    const checkInterval = setInterval(() => {
      const now = new Date();
      
      // 更新进度
      updateProgress();

      // 检查提醒
      plans.forEach(plan => {
        if (!plan.completed) {
          const [hours, minutes] = plan.time.split(' ')[1].split(':');
          const medicationTime = new Date();
          medicationTime.setHours(parseInt(hours));
          medicationTime.setMinutes(parseInt(minutes));

          const timeDiff = medicationTime.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          if (minutesDiff <= 30 && minutesDiff > 0) {
            notificationService.scheduleNotification(
              '用药提醒',
              `请在${minutesDiff}分钟内服用${plan.medicine} ${plan.dosage}`,
              now.getTime()
            );
          }
        }
      });
    }, 60000); // 每分钟检查一次

    return () => {
      clearInterval(checkInterval);
    };
  }, [plans, updateProgress]);

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

    // 进度会通过 useEffect 自动更新
    setVisible(false);
    setSelectedPlanIndex(null);
  };

  const handleDismissDialog = () => {
    setVisible(false);
    setSelectedPlanIndex(null);
  };

  const rewardEggs = Math.floor(progress / 20); // 每20%进度可以兑换一个鸡蛋

  return {
    plans,
    progress,
    visible,
    handleCardPress,
    handleUpload,
    handleDismissDialog,
    rewardEggs,
  };
}