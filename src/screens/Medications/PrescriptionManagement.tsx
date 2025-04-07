import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withRoleAccess } from '@/components/molecules/WithRoleAccess';

function PrescriptionManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>处方管理</Text>
      <Text>此页面仅医生可见</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

// 使用 HOC 包装组件，限制只有医生角色可以访问
export default withRoleAccess(PrescriptionManagementScreen, ['doctor']);