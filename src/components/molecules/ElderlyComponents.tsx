import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTTS } from '../../hooks/useTTS';
import { ElderlyTTSControl } from '../../components/molecules/ElderlyTTSControl';

/**
 * 适老化重要操作组件
 * 自动为重要操作添加语音播报功能
 */
export const ElderlyActionButton = ({ 
  title, 
  description, 
  icon, 
  onPress, 
  variant = 'primary',
  isImportant = false
}) => {
  const { speak, settings } = useTTS();
  
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
        return styles.buttonSecondary;
      case 'warning':
        return styles.buttonWarning;
      case 'danger':
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'warning':
        return styles.textWarning;
      case 'danger':
        return styles.textDanger;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {icon && <Icon name={icon} size={24} style={[styles.icon, getTextStyle()]} />}
        <Text style={[styles.title, getTextStyle()]}>{title}</Text>
      </TouchableOpacity>
      
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
          
          {isImportant && (
            <ElderlyTTSControl 
              text={`${title}。${description}`}
              label="朗读说明"
              size="small"
              autoPlay={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

/**
 * 适老化操作确认对话框
 * 重要操作会自动朗读确认信息
 */
export const ElderlyConfirmDialog = {
  show: (title, message, onConfirm, onCancel) => {
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

/**
 * 适老化提示信息组件
 * 自动为重要提示添加语音播报功能
 */
export const ElderlyNotification = ({ 
  title, 
  message, 
  type = 'info',
  isImportant = false,
  autoPlay = false
}) => {
  const { speak, settings } = useTTS();
  
  // 根据类型获取图标
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };
  
  // 根据类型获取样式
  const getContainerStyle = () => {
    switch (type) {
      case 'success':
        return styles.notificationSuccess;
      case 'warning':
        return styles.notificationWarning;
      case 'error':
        return styles.notificationError;
      default:
        return styles.notificationInfo;
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
      <View style={styles.notificationHeader}>
        <Icon name={getIconName()} size={24} color="#fff" />
        <Text style={styles.notificationTitle}>{title}</Text>
      </View>
      
      <Text style={styles.notificationMessage}>{message}</Text>
      
      {isImportant && (
        <View style={styles.notificationControls}>
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
  buttonPrimary: {
    backgroundColor: '#2196F3',
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonWarning: {
    backgroundColor: '#ff9800',
  },
  buttonDanger: {
    backgroundColor: '#f44336',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: '#333',
  },
  textWarning: {
    color: '#fff',
  },
  textDanger: {
    color: '#fff',
  },
  descriptionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  notificationContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  notificationInfo: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  notificationSuccess: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  notificationWarning: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  notificationError: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
    padding: 16,
  },
  notificationControls: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
  },
});
