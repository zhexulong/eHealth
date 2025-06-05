import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface PauseIconProps {
  size?: number;
  color?: string;
}

export const PauseIcon: React.FC<PauseIconProps> = ({ size = 16, color }) => {
  const { colors } = useTheme();
  const iconColor = color || colors.gray600;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
      <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </Svg>
  );
};