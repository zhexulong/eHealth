import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface PlayIconProps {
  size?: number;
  color?: string;
}

export const PlayIcon: React.FC<PlayIconProps> = ({ size = 16, color }) => {
  const { colors } = useTheme();
  const iconColor = color || colors.gray600;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
      <Path d="M8 5v14l11-7z" />
    </Svg>
  );
};