import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useTTS } from '../../hooks/useTTS';
import { ElderlyTTSControl } from '../../components/molecules/ElderlyTTSControl';
import { useTheme } from '@/theme';

// 定义组件属性接口
interface ElderlyActionButtonProps {
  title: string;
  description?: string;
  icon?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  isImportant?: boolean;
}

/**
 * 适老化重要操作组件
 * 自动为重要操作添加语音播报功能
 */
export const ElderlyActionButton: React.FC<ElderlyActionButtonProps> = ({ 
  title, 
  description, 
  icon, 
  onPress, 
  variant = 'primary',
  isImportant = false
}) => {
  const { speak, settings } = useTTS();
  const { colors, backgrounds, fonts } = useTheme();
  
  const handlePress = () => {
    // 如果是重要操作且启用了自动播报，播放操作描述
    if (isImportant && settings.enabled && settings.autoPlay) {
      speak(`${title}。${description || ''}`);
    }
    
    // 调用原始操作处理函数
    if (onPress) {
      onPress();
    }
  };
  
  // 获取样式
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: backgrounds.gray100.backgroundColor, borderWidth: 1, borderColor: colors.gray300 };
      case 'warning':
        return { backgroundColor: colors.warning };
      case 'danger':
        return { backgroundColor: colors.error };
      default:
        return { backgroundColor: colors.primary };
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return { color: fonts.gray800.color };
      default:
        return { color: colors.white };
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPress={handlePress}
        activeOpacity={0.8}
      >        {icon && (
          <View style={styles.icon}>
            <Text style={[{ fontSize: 20 }, getTextStyle()]}>
              {getIconText(icon)}
            </Text>
          </View>
        )}
        <Text style={[styles.title, getTextStyle()]}>{title}</Text>
      </TouchableOpacity>
      
      {description && (
        <View style={[styles.descriptionContainer, { backgroundColor: backgrounds.gray50.backgroundColor }]}>
          <Text style={[styles.description, { color: fonts.gray600.color }]}>{description}</Text>
          
          {isImportant && (
            <ElderlyTTSControl 
              text={`${title}。${description}`}
              label="朗读说明"
              size="small"
              autoPlay={false}
            />
          )}
        </View>      )}
    </View>
  );
};

// 将icon名称转换为文字图标的辅助函数
const getIconText = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    'home': '首页',
    'settings': '设置',
    'person': '个人',  
    'phone': '电话',
    'email': '邮件',
    'edit': '编辑',
    'delete': '删除',
    'add': '添加',
    'search': '搜索',
    'check': '确认',
    'warning': '警告',
    'error': '错误',
    'info': '信息'
  };
  return iconMap[iconName] || '•';
};

/**
 * 适老化操作确认对话框
 * 重要操作会自动朗读确认信息
 */
export const ElderlyConfirmDialog = {
  show: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    const { speak, settings } = useTTS();
    
    // 如果启用了自动播报，播放确认信息
    if (settings.enabled && settings.autoPlay) {
      speak(`${title}。${message}`);
    }
    
    Alert.alert(
      title,
      message,
      [
        {
          text: '取消',
          onPress: onCancel,
          style: 'cancel',
        },
        { text: '确认', onPress: onConfirm },
      ],
      { cancelable: false }
    );
  },
};

// ElderlyNotification 组件属性接口
interface ElderlyNotificationProps {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isImportant?: boolean;
  autoPlay?: boolean;
}

/**
 * 适老化提示信息组件
 * 自动为重要提示添加语音播报功能
 */
export const ElderlyNotification: React.FC<ElderlyNotificationProps> = ({ 
  title, 
  message, 
  type = 'info',
  isImportant = false,
  autoPlay = false
}) => {
  const { speak, settings } = useTTS();
  const { colors, backgrounds, fonts } = useTheme();
    // 根据类型获取图标
  const getIconText = () => {
    switch (type) {
      case 'success':
        return '成功';
      case 'warning':
        return '警告';
      case 'error':
        return '错误';
      default:
        return '信息';
    }
  };
  
  // 根据类型获取样式
  const getContainerStyle = () => {
    switch (type) {
      case 'success':
        return { 
          backgroundColor: colors.success + '20', 
          borderLeftColor: colors.success 
        };
      case 'warning':
        return { 
          backgroundColor: colors.warning + '20', 
          borderLeftColor: colors.warning 
        };
      case 'error':
        return { 
          backgroundColor: colors.error + '20', 
          borderLeftColor: colors.error 
        };
      default:
        return { 
          backgroundColor: colors.info + '20', 
          borderLeftColor: colors.info 
        };
    }
  };
  
  // 自动朗读重要提示
  useEffect(() => {
    const shouldAutoPlay = autoPlay || (isImportant && settings.enabled && settings.autoPlay);
    
    if (shouldAutoPlay) {
      speak(`${title}。${message}`);
    }
  }, [title, message, isImportant, autoPlay, settings.enabled, settings.autoPlay]);

  return (
    <View style={[styles.notificationContainer, getContainerStyle()]}>
      <View style={[styles.notificationHeader, { backgroundColor: backgrounds.gray100.backgroundColor }]}>
        <Text style={[{ fontSize: 24, marginRight: 8 }, { color: fonts.gray800.color }]}>
          {getIconText()}
        </Text>
        <Text style={[styles.notificationTitle, { color: fonts.gray800.color }]}>{title}</Text>
      </View>
      
      <Text style={[styles.notificationMessage, { color: fonts.gray700.color }]}>{message}</Text>
      
      {isImportant && (
        <View style={[styles.notificationControls, { backgroundColor: backgrounds.gray50.backgroundColor }]}>
          <ElderlyTTSControl
            text={`${title}。${message}`}
            label="朗读此提示"
            size="small"
            autoPlay={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
  },
  notificationContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 16,
    padding: 16,
  },
  notificationControls: {
    padding: 8,
    alignItems: 'center',
  },
});
