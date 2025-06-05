import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/theme';

interface ProgressFaceProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressFace: React.FC<ProgressFaceProps> = ({
  progress,
  size = 120,
  strokeWidth = 12,
}) => {
  const { colors } = useTheme();
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // 动画值
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.2)).current;
  
  // 根据进度选择表情
  const getEmoji = (progress: number): string => {
    if (progress <= 20) return '😫';
    if (progress <= 40) return '😟';
    if (progress <= 60) return '😐';
    if (progress <= 80) return '🙂';
    return '😊';
  };
  // 获取渐变色
  const getGradientColors = (progress: number): [string, string] => {
    if (progress >= 80) {
      return [colors.success, colors.success]; // 绿色
    } else if (progress >= 60) {
      return [colors.primary, colors.primaryDark]; // 蓝色
    } else if (progress >= 40) {
      return [colors.warning, colors.warning]; // 黄色
    } else {
      return [colors.error, colors.error]; // 红色
    }
  };

  // 动画效果
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 光效动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [progress]);

  const gradientColors = getGradientColors(progress);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* 发光背景 */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: gradientColors[0],
            opacity: glowOpacity,
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            transform: [{ scale: 1.2 }],
          },
        ]}
      />
      
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        {/* 背景圆环 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primaryLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆环 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      
      {/* 表情 */}
      <View style={[
        styles.emojiContainer,
        {
          width: size,
          height: size,
        }
      ]}>
        <Text style={[
          styles.emoji,
          {
            fontSize: size * 0.4,
          }
        ]}>
          {getEmoji(progress)}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    zIndex: -1,
  },
  emojiContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
