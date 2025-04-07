import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PauseIcon = ({ size = 16, color = '#666666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </Svg>
);