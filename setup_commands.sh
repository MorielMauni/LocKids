#!/bin/bash

# ==========================================
# LocKids Project Setup Commands
# ==========================================

# 1. Initialize the React Native App
# We use the React Native Community CLI for a bare workflow.
npx -y @react-native-community/cli@latest init LocKids

# Move inside the project directory
cd LocKids || exit

# 2. Install required dependencies
# react-native-biometrics: For FaceID/Fingerprint authentication
# @sayem314/react-native-keep-awake: To keep the screen alive during lock mode
# react-native-permissions: Universal way to handle and check permissions
npm install react-native-biometrics @sayem314/react-native-keep-awake react-native-permissions

# 3. Setup react-native-permissions (iOS)
# Add specific permission handlers to Podfile (this typically goes into ios/Podfile, but we provide instructions in README for exact steps)
echo "Please remember to modify your ios/Podfile for react-native-permissions as detailed in README.md"

# 4. Install iOS Pods
cd ios
pod install
cd ..

echo "Dependencies installed successfully! Next, copy the custom source code and native modules into the corresponding directories."
