import { Animated, Easing } from 'react-native';

// 标准动画时长
export const DURATIONS = {
  short: 200,
  medium: 300,
  long: 400,
};

// 标准缓动函数
export const EASINGS = {
  // 默认缓动，适用于大多数场景
  default: Easing.bezier(0.4, 0, 0.2, 1),
  // 加速缓动，适用于元素退出场景
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  // 减速缓动，适用于元素进入场景
  decelerate: Easing.bezier(0, 0, 0.2, 1),
};

// 通用动画预设
export const animations = {
  // 淡入淡出
  fade: (value: Animated.Value, toValue: number, duration = DURATIONS.medium) => {
    return Animated.timing(value, {
      toValue,
      duration,
      easing: EASINGS.default,
      useNativeDriver: true,
    });
  },

  // 缩放
  scale: (value: Animated.Value, toValue: number, duration = DURATIONS.medium) => {
    return Animated.timing(value, {
      toValue,
      duration,
      easing: EASINGS.default,
      useNativeDriver: true,
    });
  },

  // 移动
  translate: (
    value: Animated.Value,
    toValue: number,
    duration = DURATIONS.medium,
  ) => {
    return Animated.timing(value, {
      toValue,
      duration,
      easing: EASINGS.default,
      useNativeDriver: true,
    });
  },

  // 按压反馈
  pressAnimation: (scale: Animated.Value) => {
    const pressIn = Animated.timing(scale, {
      toValue: 0.95,
      duration: DURATIONS.short,
      easing: EASINGS.default,
      useNativeDriver: true,
    });

    const pressOut = Animated.timing(scale, {
      toValue: 1,
      duration: DURATIONS.short,
      easing: EASINGS.default,
      useNativeDriver: true,
    });

    return { pressIn, pressOut };
  },

  // 列表项动画
  listItem: {
    // 列表项进入动画
    enter: (
      index: number,
      translateY: Animated.Value,
      opacity: Animated.Value,
    ) => {
      const delay = index * 50; // 错开时间
      return Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: DURATIONS.medium,
          delay,
          easing: EASINGS.decelerate,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATIONS.medium,
          delay,
          easing: EASINGS.default,
          useNativeDriver: true,
        }),
      ]);
    },
  },
};
