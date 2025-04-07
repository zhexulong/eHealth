import { useCallback, useEffect, useState } from 'react';
import { AuthService } from './authService';
import type { LoginPayload, User } from './types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化时检查存储的认证状态
  useEffect(() => {
    const storedUser = AuthService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.login(payload);
      console.log('Login response:', response); // 添加调试日志
      setUser(response.user);
      return response; // 返回登录响应
    } catch (err) {
      console.error('Login error:', err); // 添加错误日志
      setError(err instanceof Error ? err.message : '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  // 检查用户角色
  const checkRole = useCallback((allowedRoles: User['role'][]) => {
    return user ? allowedRoles.includes(user.role) : false;
  }, [user]);

  const isDoctor = useCallback(() => checkRole(['doctor']), [checkRole]);
  const isPatient = useCallback(() => checkRole(['patient']), [checkRole]);
  const isCaregiver = useCallback(() => checkRole(['caregiver']), [checkRole]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: Boolean(user),
    isDoctor,
    isPatient,
    isCaregiver,
  };
}