import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private static instance: NotificationService;
  private channelId: string = 'medication-reminders';

  private constructor() {
    this.initialize();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initialize() {
    // 请求通知权限
    await notifee.requestPermission();

    // 创建通知渠道（仅Android需要）
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: this.channelId,
        name: '用药提醒',
        description: '用于发送用药提醒的通知',
        sound: 'default',
        importance: AndroidImportance.HIGH,
        vibration: true,
      });
    }

    // 监听通知事件
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('用户点击了通知', detail.notification);
          break;
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('用户在后台点击了通知', detail.notification);
          break;
      }
    });
  }

  public async scheduleNotification(title: string, message: string, timestamp: number) {
    try {
      await notifee.displayNotification({
        title,
        body: message,
        android: {
          channelId: this.channelId,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('发送通知失败:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();