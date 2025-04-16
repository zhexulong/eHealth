import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { ViewStyle } from 'react-native';

interface ReminderCardProps {
  title: string;
  time: string;
  description: string;
  completed?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  time,
  description,
  completed = false,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[
        styles.card,
        completed && { opacity: 0.7, backgroundColor: theme.colors.surfaceVariant },
        style,
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.container}>
        <View>
          <Text
            variant="titleLarge"
            style={[
              { color: theme.colors.primary },
              completed && styles.completedText,
            ]}
          >
            {title}
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              { color: theme.colors.onSurfaceVariant },
              completed && styles.completedText,
            ]}
          >
            {time}
          </Text>
        </View>
        <Text
          variant="bodyLarge"
          style={[
            { color: theme.colors.onSurface },
            completed && styles.completedText,
          ]}
        >
          {description}
        </Text>
        {completed && (
          <View style={styles.completedLine} />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 12,
  },
  container: {
    gap: 8,
  },
  completedText: {
    color: 'gray',
    textDecorationLine: 'line-through',
  },
  completedLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'gray',
  },
});