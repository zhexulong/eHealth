import { MMKV } from 'react-native-mmkv';
import { AuthResponse, LoginPayload, User } from './types';

const storage = new MMKV();
const AUTH_TOKEN_KEY = '@auth_token';
const USER_KEY = '@user';

// 模拟API调用的延迟效果
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  static async login(payload: LoginPayload): Promise<AuthResponse> {
    // 模拟API调用
    await delay(1000);
    
    console.log('AuthService: Processing login for:', payload.email);
    
    // 模拟响应数据
    const response: AuthResponse = {
      user: {
        id: '1',
        email: payload.email,
        name: 'Test User',
        role: 'patient',
      },
      accessToken: 'mock_jwt_token',
    };

    // 确保在存储之前清除旧数据
    this.logout();
    
    // 存储认证信息
    console.log('AuthService: Storing auth data');
    this.setAuthData(response);
    
    // 验证数据是否正确存储
    const storedToken = this.getAuthToken();
    const storedUser = this.getUser();
    console.log('AuthService: Stored data verification:', { 
      hasToken: !!storedToken,
      hasUser: !!storedUser 
    });
    
    return response;
  }

  static setAuthData(data: AuthResponse) {
    storage.set(AUTH_TOKEN_KEY, data.accessToken);
    storage.set(USER_KEY, JSON.stringify(data.user));
  }

  static getAuthToken(): string | null {
    return storage.getString(AUTH_TOKEN_KEY) || null;
  }

  static getUser(): User | null {
    const userData = storage.getString(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static logout() {
    storage.delete(AUTH_TOKEN_KEY);
    storage.delete(USER_KEY);
  }

  static isAuthenticated(): boolean {
    return Boolean(this.getAuthToken());
  }
}