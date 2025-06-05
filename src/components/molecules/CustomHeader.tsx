import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '@/theme';
import { HeaderTTSButton } from './HeaderTTSButton';

interface CustomHeaderProps {
  title: string;
  screenText: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, screenText }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.headerContainer}>
      <Text style={{ color: colors.gray900, fontSize: 30, fontWeight: 'bold' }}>
        {title}
      </Text>
      <HeaderTTSButton screenText={screenText} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
});
