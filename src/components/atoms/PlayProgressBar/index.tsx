import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { TTSProgressEvent } from '@/hooks/useTTS';

interface PlayProgressBarProps {
  progress: TTSProgressEvent | null;
  color?: string;
  height?: number;
}

export const PlayProgressBar = ({ 
  progress, 
  color = '#007AFF',
  height = 2 
}: PlayProgressBarProps) => {
  const progressWidth = progress 
    ? (progress.location / progress.length) * 100 
    : 0;

  return (
    <View style={[styles.container, { height }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${progressWidth}%`,
            backgroundColor: color 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E5E5EA',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});