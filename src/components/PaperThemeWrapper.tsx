import React from 'react';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useTheme } from '@/theme';

interface Props {
  children: React.ReactNode;
}

export function PaperThemeWrapper({ children }: Props) {
  const { variant, colors } = useTheme();

  // 创建与我们的主题系统同步的Paper主题
  const paperTheme = variant === 'dark' 
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: colors.primary,
          secondary: colors.primaryLight,
          surface: colors.gray100,
          background: colors.gray50,
          onBackground: colors.gray900,
          onSurface: colors.gray800,
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: colors.primary,
          secondary: colors.primaryLight,
          surface: colors.white,
          background: colors.gray50,
          onBackground: colors.gray900,
          onSurface: colors.gray800,
        },
      };

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  );
}
