import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Card, List, FAB } from 'react-native-paper';
import { withRoleAccess } from '@/components/molecules/WithRoleAccess';
import { SafeScreen } from '@/components/templates';

function PrescriptionManagementScreen() {
  return (
    <SafeScreen>
      <Surface style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="处方管理" subtitle="此页面仅医生可见" />
          <Card.Content>
            <List.Section>
              <List.Subheader>当前处方列表</List.Subheader>
              <List.Item
                title="暂无处方记录"
                left={props => <List.Icon {...props} icon="file-document-outline" />}
              />
            </List.Section>
          </Card.Content>
        </Card>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {}}
          label="新增处方"
        />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

// 使用 HOC 包装组件，限制只有医生角色可以访问
export default withRoleAccess(PrescriptionManagementScreen, ['doctor']);