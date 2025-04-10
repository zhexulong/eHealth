import React, { useCallback } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { animations } from '@/theme/animations';
import type { ViewStyle } from 'react-native';

interface MedicalCardProps {
  title: string;
  description: string;
  status?: 'normal' | 'warning' | 'success' | 'error';
  onPress?: () => void;
  style?: ViewStyle;
}

export const MedicalCard: React.FC<MedicalCardProps> = ({
  title,
  description,
  status = 'normal',
  onPress,
  style,
}) => {
  const { components, fonts, colors } = useTheme();
  const scale = new Animated.Value(1);
  
  // 获取状态颜色
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  // 处理按压动画
  const handlePressIn = useCallback(() => {
    animations.pressAnimation(scale).pressIn.start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    animations.pressAnimation(scale).pressOut.start();
  }, [scale]);

  return (
    <Animated.View
      style={[
        components.card,
        {
          transform: [{ scale }],
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(),
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.container}>
          <Text style={[fonts.h5, { color: colors.gray800 }]}>{title}</Text>
          <Text style={[fonts.body2, { color: colors.gray600 }]}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
