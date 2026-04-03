import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, SafeAreaView, Image, AppState } from 'react-native';
import { usePermissions } from '../hooks/usePermissions';
import BiometricService from '../services/BiometricService';
import { NativeModules } from 'react-native';

const { FloatingLockModule } = NativeModules;

export default function ActivationScreen() {
  const { hasOverlayPermission, requestOverlayPermission } = usePermissions();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && Platform.OS === 'android' && FloatingLockModule) {
        try {
          const locked = await FloatingLockModule.isLocked();
          if (locked) {
             const hasBio = await BiometricService.checkBiometricsAvailable();
             if (hasBio) {
                const unlocked = await BiometricService.authenticateAndUnlock();
                if (!unlocked) {
                   FloatingLockModule.resumeLock();
                } else {
                   FloatingLockModule.unlock();
                   setIsActive(false);
                }
             } else {
                FloatingLockModule.unlock();
                setIsActive(false);
             }
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });
    return () => subscription.remove();
  }, []);

  const toggleActivate = () => {
    if (Platform.OS === 'android' && !hasOverlayPermission) {
      requestOverlayPermission();
      return;
    }

    if (Platform.OS === 'android' && FloatingLockModule) {
        if (!isActive) {
            FloatingLockModule.startService();
        } else {
            FloatingLockModule.stopService();
        }
    }
    
    setIsActive(!isActive);
  };

  const LogoComponent = () => (
    <Image 
       source={require('../../logo-white.png')} 
       style={styles.logo} 
       resizeMode="contain" 
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LogoComponent />
        <Text style={styles.title}>LocKids</Text>
      </View>

      {Platform.OS === 'ios' ? (
        <View style={styles.card}>
          <Text style={styles.iosWarning}>
            System overlays are not allowed on iOS. To secure your device for children, please enable Apple's built-in "Guided Access".
          </Text>
          <Text style={styles.step}>1. Go to Settings {'>'} Accessibility {'>'} Guided Access.</Text>
          <Text style={styles.step}>2. Turn on Guided Access and set a Passcode.</Text>
          <Text style={styles.step}>3. Open the app (like YouTube) you want your child to use.</Text>
          <Text style={styles.step}>4. Triple-click the Side/Home button to start.</Text>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {!hasOverlayPermission && (
            <View style={styles.permissionCard}>
              <Text style={styles.warningText}>
                LocKids requires "Draw over other apps" permission to display the lock button over other applications.
              </Text>
              <TouchableOpacity style={styles.button} onPress={requestOverlayPermission}>
                <Text style={styles.buttonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.card, { opacity: hasOverlayPermission ? 1 : 0.5 }]}>
            <Text style={styles.label}>Activate Floating Lock</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isActive ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleActivate}
              value={isActive}
              disabled={!hasOverlayPermission}
            />
          </View>
          
          <Text style={styles.description}>
            When activated, a floating lock icon will appear. Tap it to lock the screen touch. To unlock, tap it again and provide biometric verification.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  logo: { width: 80, height: 80, backgroundColor: '#000', borderRadius: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 10, color: '#333' },
  card: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  permissionCard: { backgroundColor: '#FFF3E0', margin: 20, padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#FFE0B2' },
  label: { fontSize: 18, fontWeight: '600' },
  warningText: { fontSize: 14, color: '#E65100', marginBottom: 15 },
  description: { marginHorizontal: 30, fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  button: { backgroundColor: '#FF9800', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  iosWarning: { fontSize: 16, color: '#D32F2F', fontWeight: 'bold', marginBottom: 15 },
  step: { fontSize: 15, marginVertical: 5, color: '#333' },
  mainContent: { flex: 1 }
});
