import React from 'react';
import { ScrollView } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { TTSPageAdapter } from '@/components/molecules/TTSPageAdapter';
import { useTheme } from '@/theme';

export function SettingsScreen() {
  const navigation = useNavigation<RootScreenProps['navigation']>();
  const theme = useTheme();

  // 准备用于朗读的屏幕内容
  const screenContent = '设置页面，包含语音设置选项。';

  const handleThemeToggle = () => {
    const nextTheme = theme.variant === 'dark' ? 'default' : 'dark';
    theme.changeTheme(nextTheme);
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.backgrounds.gray50.backgroundColor }}>
      <List.Section>
        <List.Subheader>显示设置</List.Subheader>
        <List.Item
          title="深色模式"
          description={theme.variant === 'dark' ? '当前为深色主题' : '当前为浅色主题'}
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={props => (
            <Switch
              value={theme.variant === 'dark'}
              onValueChange={handleThemeToggle}
            />
          )}
        />
      </List.Section>
      
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
