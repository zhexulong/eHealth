import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MedicationsScreen() {
  return (
    <View style={styles.container}>
      <Text>用药管理</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});