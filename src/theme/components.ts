import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/theme/types/theme';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AllStyle
  extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

export default ({ backgrounds, fonts, layout, borders }: ComponentTheme) => {
  return {
    // 基础按钮样式
    buttonPrimary: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      backgroundColor: backgrounds.primary.backgroundColor,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonSecondary: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      backgroundColor: backgrounds.white.backgroundColor,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: backgrounds.primary.backgroundColor,
    },
    
    // 卡片样式
    card: {
      backgroundColor: backgrounds.white.backgroundColor,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    
    // 输入框样式
    input: {
      backgroundColor: backgrounds.gray50.backgroundColor,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: backgrounds.gray300.backgroundColor,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: fonts.gray800.color,
    },
    
    // 列表项样式
    listItem: {
      ...layout.row,
      ...layout.itemsCenter,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: backgrounds.gray200.backgroundColor,
    },

    // 状态标签样式
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      ...layout.itemsCenter,
      ...layout.justifyCenter,
    },
    
    // 圆形按钮（用于浮动操作按钮）
    buttonCircle: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      backgroundColor: backgrounds.primary.backgroundColor,
      borderRadius: 28,
      height: 56,
      width: 56,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },

    // 头部导航样式
    header: {
      ...layout.row,
      ...layout.itemsCenter,
      ...layout.justifyBetween,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: backgrounds.white.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: backgrounds.gray200.backgroundColor,
      height: 56,
    },

    circle250: {
      borderRadius: 140,
      height: 250,
      width: 250,
    },
  } as const satisfies AllStyle;
};
