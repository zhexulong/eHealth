import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, Card, Button } from 'react-native-paper';
import { SafeScreen } from '@/components/templates';

export function MedicationsScreen() {
  return (
    <SafeScreen>
      <Surface style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="用药管理" />
          <Card.Content>
            <Text variant="bodyLarge">您的用药提醒和记录将显示在这里</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => {}}>添加用药提醒</Button>
          </Card.Actions>
        </Card>
      </Surface>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
});