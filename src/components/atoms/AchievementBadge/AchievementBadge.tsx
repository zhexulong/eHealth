import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '@/theme';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
}) => {
  const { gutters } = useTheme();

  return (
    <Card style={{ width: '47%' }}>
      <Card.Content style={{ alignItems: 'center' }}>
        <Text variant="displaySmall" style={gutters.marginBottom_8}>
          {icon}
        </Text>
        <Text variant="titleMedium" style={gutters.marginBottom_4}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ textAlign: 'center' }}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
};