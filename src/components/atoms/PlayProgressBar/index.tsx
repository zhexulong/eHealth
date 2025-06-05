import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { TTSProgressEvent } from '@/hooks/useTTS';
import { useTheme } from '@/theme';

interface PlayProgressBarProps {
  progress: TTSProgressEvent | null;
  color?: string;
  height?: number;
}

export const PlayProgressBar = ({ 
  progress, 
  color,
  height = 2 
}: PlayProgressBarProps) => {
  const { colors } = useTheme();
  const defaultColor = color || colors.primary;
  
  const progressWidth = progress 
    ? (progress.location / progress.length) * 100 
    : 0;

  return (
    <View style={[styles.container, { height, backgroundColor: colors.gray300 }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${progressWidth}%`,
            backgroundColor: defaultColor 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor will be set by inline styles
    borderRadius: 1,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});