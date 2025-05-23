import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { 
  ElderlyActionButton, 
  ElderlyNotification,
  ElderlyConfirmDialog
} from '../../components/molecules/ElderlyComponents';
import { ElderlyTTSControl } from '../../components/molecules/ElderlyTTSControl';

/**
 * 适老化示例屏幕
 * 展示如何在关键操作中集成语音播报功能
 */
export const ElderlyDemoScreen = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  
  // 模拟用药提醒内容
  const medicationReminder = `
    您今天需要服用的药物：
    1. 降压药 - 早晨9点，饭后30分钟
    2. 降糖药 - 中午12点，饭后即服
    3. 钙片 - 晚上9点，睡前服用

    请记得按时服药，保持良好的作息习惯。
    如有不适，请立即联系您的主治医生。
  `.trim();
  
  // 模拟健康建议内容
  const healthAdvice = `
    根据您近期的血压监测数据，我们有以下建议：
    
    1. 坚持低盐饮食，每天摄入盐不超过5克
    2. 适量增加户外活动，每天步行30分钟
    3. 避免情绪波动，保持心情舒畅
    4. 按时服用医生开具的药物
    
    这些措施有助于稳定您的血压，减少并发症风险。
  `.trim();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>适老化功能示例</Text>
        
        {/* 药物提醒部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日用药提醒</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>您有3项用药提醒</Text>
            <Text style={styles.cardContent}>{medicationReminder}</Text>
            
            <ElderlyTTSControl
              text={`今日用药提醒。${medicationReminder}`}
              label="朗读用药提醒"
              size="large"
              autoPlay={true}
            />
          </View>
          
          <ElderlyActionButton 
            title="我已服药"
            description="点击确认您已完成今日所有用药"
            icon="check"
            variant="primary"
            isImportant={true}
            onPress={() => {
              ElderlyConfirmDialog.show(
                '确认服药',
                '您确认已完成今日所有药物服用吗？',
                () => setShowSuccessMessage(true),
                () => console.log('用户取消确认')
              );
            }}
          />
          
          {showSuccessMessage && (
            <ElderlyNotification 
              title="服药记录已保存"
              message="您的服药情况已记录，感谢您的坚持！"
              type="success"
              isImportant={true}
              autoPlay={true}
            />
          )}
        </View>
        
        {/* 健康建议部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>健康建议</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>血压管理建议</Text>
            <Text style={styles.cardContent}>{healthAdvice}</Text>
            
            <ElderlyTTSControl
              text={`血压管理建议。${healthAdvice}`}
              label="朗读健康建议"
              size="medium"
            />
          </View>
          
          <ElderlyActionButton 
            title="需要进一步咨询"
            description="如果您对建议有疑问，可以联系您的家庭医生"
            icon="phone"
            variant="secondary"
            isImportant={false}
            onPress={() => {
              ElderlyConfirmDialog.show(
                '联系医生',
                '是否现在联系您的家庭医生进行咨询？',
                () => setShowWarningMessage(true),
                () => console.log('用户取消联系')
              );
            }}
          />
          
          {showWarningMessage && (
            <ElderlyNotification 
              title="连接中"
              message="正在连接您的家庭医生，请稍候..."
              type="warning"
              isImportant={true}
            />
          )}
        </View>
        
        {/* 紧急操作部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>紧急服务</Text>
          
          <ElderlyActionButton 
            title="呼叫急救"
            description="仅在紧急情况下使用，将直接拨打120急救电话"
            icon="emergency"
            variant="danger"
            isImportant={true}
            onPress={() => {
              ElderlyConfirmDialog.show(
                '紧急呼叫',
                '确认拨打120急救电话吗？请仅在紧急情况下使用此功能。',
                () => console.log('用户确认拨打急救电话'),
                () => console.log('用户取消拨打')
              );
            }}
          />
          
          <ElderlyNotification 
            title="安全提示"
            message="请将您的紧急联系人信息保持更新，以便在紧急情况下能及时通知您的家人。"
            type="info"
            isImportant={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    paddingLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
});
