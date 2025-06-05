import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '@/theme';
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
  const { colors } = useTheme();
  
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

  return (
    <Card
      style={[
        styles.card,
        {
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(),
        },
        style,
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.container}>
        <Text variant="titleLarge" style={{ color: colors.gray900 }}>{title}</Text>
        <Text variant="bodyMedium" style={{ color: colors.gray600 }}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
  },
  container: {
    gap: 8,
  },
});
