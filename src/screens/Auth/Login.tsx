import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/domain/auth/useAuth';
import { useTheme } from '@/theme';
import type { AuthStackScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { SafeScreen } from '@/components/templates';

export function LoginScreen({ navigation }: AuthStackScreenProps<Paths.Login>) {
  const { login, isLoading, error } = useAuth();
  const { colors, fonts, components, layout, gutters } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    try {
      await login({ email, password });
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Main }],
      });
    } catch (err) {
      Alert.alert('登录失败', error || '请稍后重试');
    }
  };

  return (
    <SafeScreen>
      <View style={[
        layout.flex_1,
        layout.justifyCenter,
        gutters.padding_20,
      ]}>
        <Text style={[fonts.h1, gutters.marginBottom_20, layout.alignCenter]}>
          登录
        </Text>
        
        <TextInput
          style={[components.input, gutters.marginBottom_15]}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.gray500}
        />
        
        <TextInput
          style={[components.input, gutters.marginBottom_15]}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.gray500}
        />

        {error && (
          <Text style={[fonts.body2, { color: colors.error }, gutters.marginBottom_15, layout.alignCenter]}>
            {error}
          </Text>
        )}

        <TouchableOpacity 
          style={[
            components.buttonPrimary,
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[fonts.button, { color: colors.white }]}>登录</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}