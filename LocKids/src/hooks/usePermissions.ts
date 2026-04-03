import { useEffect, useState } from 'react';
import { Platform, NativeModules, AppState } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { FloatingLockModule } = NativeModules;

export function usePermissions() {
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkOverlayPermission();
      }
    });
    checkOverlayPermission();
    return () => subscription.remove();
  }, []);

  const checkOverlayPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await FloatingLockModule.checkOverlayPermission();
        setHasOverlayPermission(hasPermission);
      } catch (e) {
        console.warn(e);
      }
    } else {
      setHasOverlayPermission(true);
    }
  };

  const requestOverlayPermission = async () => {
    if (Platform.OS === 'android' && FloatingLockModule) {
      try {
        await FloatingLockModule.requestOverlayPermission();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return {
    hasOverlayPermission,
    checkOverlayPermission,
    requestOverlayPermission
  };
}
