import type { PropsWithChildren } from 'react';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';

import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

import { ErrorBoundary } from '@/components/organisms';

type Props = PropsWithChildren<
  {
    isError?: boolean;
    onResetError?: () => void;
  } & Omit<SafeAreaViewProps, 'mode'>
>;

function SafeScreen({
  children = undefined,
  isError = false,
  onResetError = undefined,
  style,
  ...props
}: Props) {
  const { layout, navigationTheme, variant, backgrounds } = useTheme();

  return (
    <SafeAreaView
      {...props}
      mode="padding"
      style={[
        layout.flex_1, 
        { backgroundColor: backgrounds.gray50.backgroundColor },
        style
      ]}
      edges={['top', 'right', 'left']}
    >
      <StatusBar
        backgroundColor={navigationTheme.colors.background}
        barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ErrorBoundary onReset={onResetError}>
        {children}
      </ErrorBoundary>
    </SafeAreaView>
  );
}

export default SafeScreen;
