import type { ThemeConfiguration } from '@/theme/types/config';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const enum Variant {
  DARK = 'dark',
}

const colorsLight = {
  // 主色调
  primary: '#2196F3',     // 医疗蓝，用于主要按钮和重要信息
  primaryLight: '#64B5F6', // 浅蓝色，用于次要信息
  primaryDark: '#1976D2',  // 深蓝色，用于标题和重点
  
  // 功能色
  success: '#4CAF50',     // 绿色，用于成功状态
  warning: '#FFC107',     // 黄色，用于警告信息
  error: '#F44336',       // 红色，用于错误信息
  info: '#2196F3',        // 蓝色，用于提示信息
  
  // 中性色
  gray50: '#FAFAFA',      // 背景色
  gray100: '#F5F5F5',     // 卡片背景
  gray200: '#EEEEEE',     // 分割线
  gray300: '#E0E0E0',     // 边框
  gray400: '#BDBDBD',     // 禁用状态
  gray500: '#9E9E9E',     // 次要文字
  gray600: '#757575',     // 主要文字
  gray700: '#616161',     // 标题文字
  gray800: '#424242',     // 重要文字
  gray900: '#212121',     // 最重要文字
  
  // 特殊用途
  accent: '#FF4081',      // 强调色，用于特殊操作
  white: '#FFFFFF',       // 纯白
  black: '#000000',       // 纯黑
  transparent: 'transparent',
} as const;

const colorsDark = {
  // 主色调（暗色模式）
  primary: '#90CAF9',     
  primaryLight: '#BBDEFB',
  primaryDark: '#64B5F6',
  
  // 功能色（暗色模式）
  success: '#81C784',
  warning: '#FFD54F',
  error: '#E57373',
  info: '#64B5F6',
  
  // 中性色（暗色模式）
  gray50: '#121212',
  gray100: '#1E1E1E',
  gray200: '#2C2C2C',
  gray300: '#3D3D3D',
  gray400: '#525252',
  gray500: '#757575',
  gray600: '#9E9E9E',
  gray700: '#BDBDBD',
  gray800: '#E0E0E0',
  gray900: '#F5F5F5',
  
  // 特殊用途（暗色模式）
  accent: '#FF80AB',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

const sizes = [12, 16, 24, 32, 40, 80] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.gray50,
        card: colorsDark.gray50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
