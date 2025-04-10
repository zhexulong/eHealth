import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { animations, DURATIONS } from '@/theme/animations';

export const useAnimatedValue = (initialValue: number = 0) => {
  const value = useRef(new Animated.Value(initialValue)).current;
  return value;
};

export const useAnimatedController = () => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const animate = useCallback(
    (type: 'enter' | 'exit', index: number = 0) => {
      const duration = DURATIONS.medium;

      switch (type) {
        case 'enter':
          return Animated.parallel([
            animations.translate(translateY, 0, duration),
            animations.fade(opacity, 1, duration),
          ]);
        case 'exit':
          return Animated.parallel([
            animations.translate(translateY, 20, duration),
            animations.fade(opacity, 0, duration),
          ]);
        default:
          return null;
      }
    },
    [translateY, opacity],
  );

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const reset = useCallback(() => {
    translateY.setValue(20);
    opacity.setValue(0);
    scale.setValue(1);
  }, [translateY, opacity, scale]);

  return {
    animate,
    reset,
    translateY,
    opacity,
    scale,
    handlePressIn,
    handlePressOut,
  };
};
