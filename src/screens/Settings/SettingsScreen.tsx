import React from 'react';
import { ScrollView } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { TTSPageAdapter } from '@/components/molecules/TTSPageAdapter';

export function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  // 准备用于朗读的屏幕内容
  const screenContent = '设置页面，包含语音设置选项。';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <List.Section>
        <List.Subheader>辅助功能</List.Subheader>
        <List.Item
          title="语音设置"
          description="调整语音播报配置、音量、速度和音色"
          left={props => <List.Icon {...props} icon="text-to-speech" />}
          onPress={() => navigation.navigate(Paths.TTSSettings)}
        />
      </List.Section>

      {/* 添加页面适配器 */}
      <TTSPageAdapter screenName="设置" screenContent={screenContent} />
    </ScrollView>
  );
}
