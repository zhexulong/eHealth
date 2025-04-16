import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';
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
  const theme = useTheme();
  
  // 获取状态颜色
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return theme.colors.warning;
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
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
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>{title}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    elevation: 2,
  },
  container: {
    gap: 8,
  },
});
