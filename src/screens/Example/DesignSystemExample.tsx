import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { MedicalCard } from '@/components/atoms/MedicalCard/MedicalCard';
import { Ripple } from '@/components/atoms/Ripple/Ripple';
import { useAnimatedController } from '@/hooks/useAnimatedController';
import { Animated } from 'react-native';

export function DesignSystemExample() {
  const { colors, fonts, components, layout } = useTheme();
  const { animate, translateY, opacity } = useAnimatedController();

  // 进入动画
  useEffect(() => {
    animate('enter').start();
  }, [animate]);

  const handleCardPress = useCallback(() => {
    console.log('Card pressed');
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{
        opacity,
        transform: [{ translateY }]
      }}>
        {/* 标题展示 */}
        <View style={[layout.col, styles.section]}>
          <Text style={[fonts.h1, { color: colors.gray900 }]}>标题 1</Text>
          <Text style={[fonts.h2, { color: colors.gray800 }]}>标题 2</Text>
          <Text style={[fonts.h3, { color: colors.gray800 }]}>标题 3</Text>
        </View>

        {/* 文本样式展示 */}
        <View style={[layout.col, styles.section]}>
          <Text style={[fonts.body1, { color: colors.gray700 }]}>
            正文文本 1 - 用于主要内容
          </Text>
          <Text style={[fonts.body2, { color: colors.gray600 }]}>
            正文文本 2 - 用于次要内容
          </Text>
          <Text style={[fonts.caption, { color: colors.gray500 }]}>
            说明文本 - 用于辅助信息
          </Text>
        </View>

        {/* 按钮展示 */}
        <View style={[layout.col, styles.section]}>
          <Ripple style={components.buttonPrimary} onPress={() => console.log('Primary')}>
            <Text style={[fonts.button, { color: colors.white }]}>主要按钮</Text>
          </Ripple>

          <View style={styles.spacing} />

          <Ripple style={components.buttonSecondary} onPress={() => console.log('Secondary')}>
            <Text style={[fonts.button, { color: colors.primary }]}>次要按钮</Text>
          </Ripple>
        </View>

        {/* 卡片展示 */}
        <View style={[layout.col, styles.section]}>
          <MedicalCard
            title="普通状态"
            description="这是一个普通状态的医疗卡片示例"
            onPress={handleCardPress}
          />
          
          <View style={styles.spacing} />

          <MedicalCard
            title="警告状态"
            description="这是一个警告状态的医疗卡片示例"
            status="warning"
            onPress={handleCardPress}
          />
          
          <View style={styles.spacing} />

          <MedicalCard
            title="成功状态"
            description="这是一个成功状态的医疗卡片示例"
            status="success"
            onPress={handleCardPress}
          />
          
          <View style={styles.spacing} />

          <MedicalCard
            title="错误状态"
            description="这是一个错误状态的医疗卡片示例"
            status="error"
            onPress={handleCardPress}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  section: {
    padding: 16,
    gap: 16,
  },
  spacing: {
    height: 16,
  },
});
