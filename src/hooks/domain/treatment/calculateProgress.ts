interface TimeSlot {
  hours: number;
  minutes: number;
}

/**
 * 解析时间字符串（格式：'HH:mm' 或 '早上/下午/晚上 HH:mm'）
 */
const parseTime = (timeStr: string): TimeSlot => {
  const timePart = timeStr.includes(' ') ? timeStr.split(' ')[1] : timeStr;
  const [hours, minutes] = timePart.split(':').map(Number);
  return { hours, minutes };
};

/**
 * 比较两个时间点的先后
 * @returns -1 if time1 < time2, 0 if equal, 1 if time1 > time2
 */
const compareTime = (time1: TimeSlot, time2: TimeSlot): number => {
  if (time1.hours < time2.hours) return -1;
  if (time1.hours > time2.hours) return 1;
  if (time1.minutes < time2.minutes) return -1;
  if (time1.minutes > time2.minutes) return 1;
  return 0;
};

/**
 * 计算当前进度
 * @param plans 所有计划任务
 * @param now 当前时间（可选，默认为现在）
 * @returns 进度百分比（0-100）
 */
export const calculateProgress = (
  plans: Array<{ time: string; completed: boolean }>,
  now = new Date()
): number => {
  if (plans.length === 0) return 100;

  const currentTime: TimeSlot = {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };

  // 计算应该完成和实际完成的任务数
  let shouldBeCompleted = 0;
  let actuallyCompleted = 0;

  plans.forEach(plan => {
    const planTime = parseTime(plan.time);
    
    // 如果计划时间早于或等于当前时间，这个任务应该完成
    if (compareTime(planTime, currentTime) <= 0) {
      shouldBeCompleted++;
      if (plan.completed) {
        actuallyCompleted++;
      }
    }
  });

  // 如果现在是一天开始，还没到任何任务时间，返回100%
  if (shouldBeCompleted === 0) return 100;

  // 计算进度：已完成/应完成
  const progress = (actuallyCompleted / shouldBeCompleted) * 100;

  return Math.round(progress);
};
