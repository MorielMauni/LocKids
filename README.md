# LocKids

LocKids is a utility app designed to lock a device's touch screen while another app is running, using Android's Native Application Overlays and React Native.

## Project Structure Overview

The codebase consists of a React Native layer for the primary user interface and Android Native Service for the floating `SYSTEM_ALERT_WINDOW`.

## Step-by-Step Compilation and Testing

### 1. Initialize the Project

First, run the provided setup script. It uses `npx @react-native-community/cli` to generate a lightweight bare React Native project.

```bash
./setup_commands.sh
```

### 2. Copy the Code Deliverables

1. **React Source**: Move the generated `src/` directory into your `LocKids` root directory.
2. **Permissions**: Review and patch your `android/app/src/main/AndroidManifest.xml` and `ios/LocKids/Info.plist` using the snippets provided in `android_manifest_snippet.xml` and `ios_plist_snippet.xml`.
3. **App Icon**: Move your desired logo (`logo-white.png`) into the root of `LocKids` or its asset folder to ensure the `ActivationScreen` UI renders properly.
4. **Android Native Modules**: Copy `FloatingLockModule.java`, `FloatingLockService.java`, and `LockidsPackage.java` into `android/app/src/main/java/com/lockids/` (replace `com.lockids` with your actual generated package name if different).
5. **Link the Native Module**: In your `MainApplication.java` inside `getPackages()`, ensure `new LockidsPackage()` is added to the list of packages.
   ```java
   @Override
   protected List<ReactPackage> getPackages() {
       List<ReactPackage> packages = new PackageList(this).getPackages();
       packages.add(new LockidsPackage()); // Add this line
       return packages;
   }
   ```

### 3. Running on Android (Emulator or Physical Device)

Because this relies on `SYSTEM_ALERT_WINDOW`, it handles best on an actual device or a stable Android emulator (API Level 28+).

1. Make sure your Android device/emulator is connected.
2. Run the Metro bundler:
   ```bash
   cd LocKids
   npm start
   ```
3. In another terminal, compile and run the app text:
   ```bash
   npx react-native run-android
   ```
4. **Testing the Overlay**:
   - Open LocKids, tap "Grant Permission" to enable Draw Over Other Apps.
   - Once granted, toggle "Activate Floating Lock".
   - You should see the semi-transparent floating Lock icon.
   - You can hit the home button, open YouTube, and hit the Lock Icon. It will consume the screen touches, allowing video to play but preventing touches.
   - Tap it again, it launches the app returning you to the `ActivationScreen`. From there, biometrics would verify to disable the lock state (this is extended through `BiometricService.ts`).

### 4. Running on iOS

1. Change into the iOS directory and install dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```
2. Run the application:
   ```bash
   npx react-native run-ios
   ```
3. On iOS, you will see the Guided Access walk-through since third-party system overlays are natively restricted.

## Future Customization

- The `react-native-keep-awake` can be optionally bound inside the React Native App state when it detects the lock has started to ensure the device never sleeps.
- Custom images can be swapped into `FloatingLockService.java` by replacing `android.R.drawable.ic_lock_lock` with your localized drawables.
