import { NativeModules, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const { FloatingLockModule } = NativeModules;
const rnBiometrics = new ReactNativeBiometrics();

class BiometricService {
  async checkBiometricsAvailable(): Promise<boolean> {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      return available;
    } catch (e) {
      console.warn('Biometric availability check failed', e);
      return false;
    }
  }

  async authenticateAndUnlock(): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock LocKids Screen',
        cancelButtonText: 'Cancel',
      });
      
      if (success && Platform.OS === 'android') {
        FloatingLockModule.unlock();
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Biometric prompt failed', e);
      return false;
    }
  }
}

export default new BiometricService();
