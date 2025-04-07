import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PlayIcon = ({ size = 16, color = '#666666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
);