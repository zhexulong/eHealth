import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const usePermissions = () => {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ];

          const results = await PermissionsAndroid.requestMultiple(permissions);
          
          const allGranted = Object.values(results).every(
            result => result === PermissionsAndroid.RESULTS.GRANTED
          );
          
          setHasPermissions(allGranted);

          if (!allGranted) {
            console.warn('未获得所有必需权限');
          }
        } catch (err) {
          console.warn('请求权限时出错:', err);
          setHasPermissions(false);
        }
      } else {
        setHasPermissions(true); // iOS 在 Info.plist 中处理权限
      }
    };

    checkPermissions();
  }, []);

  return hasPermissions;
};