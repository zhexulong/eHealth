import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import type { PressableProps, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

interface RippleProps extends PressableProps {
  children: React.ReactNode;
  rippleColor?: string;
  rippleOpacity?: number;
  rippleDuration?: number;
  style?: ViewStyle;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  rippleColor,
  rippleOpacity = 0.3,
  rippleDuration = 400,
  style,
  onPressIn,
  ...props
}) => {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(rippleOpacity)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      onPressIn?.(e);
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: rippleDuration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: rippleOpacity,
            duration: rippleDuration * 0.25,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: rippleDuration * 0.75,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    },
    [scale, opacity, rippleDuration, rippleOpacity, onPressIn],
  );

  useEffect(() => {
    return () => {
      scale.setValue(0);
      opacity.setValue(rippleOpacity);
    };
  }, [scale, opacity, rippleOpacity]);

  return (
    <Pressable onPressIn={handlePressIn} style={[styles.container, style]} {...props}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.ripple,
            {
              backgroundColor: rippleColor || colors.gray400,
              opacity,
              transform: [{ scale }],
            },
          ]}
        />
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  ripple: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
