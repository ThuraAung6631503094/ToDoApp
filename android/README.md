# Android Build Configuration

This directory contains the Android-specific configuration files for the ToDoListApp. This guide will help you set up and build the Android APK.

## Prerequisites

1. Java Development Kit (JDK) 17 or later
2. Android Studio
3. Android SDK
4. Environment variables set up:
   - JAVA_HOME
   - ANDROID_HOME
   - PATH (including Android SDK tools)

## Configuration Files

- `build.gradle` - Root project build configuration
- `app/build.gradle` - App-specific build configuration
- `gradle.properties` - Gradle and Android properties
- `gradle/wrapper/gradle-wrapper.properties` - Gradle version configuration

## Building the APK

### Method 1: Using EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure the build:
```bash
eas build:configure
```

3. Build the APK:
```bash
eas build -p android --profile preview
```

### Method 2: Local Build

1. Generate debug keystore (if not exists):
```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
cd ../..
```

2. Clean the project:
```bash
cd android
./gradlew clean
cd ..
```

3. Build the APK:
```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Common Issues

1. **Java not found**
   - Ensure JAVA_HOME is set correctly
   - Verify Java installation
   - Restart terminal/IDE

2. **Gradle build failures**
   - Clean the project: `./gradlew clean`
   - Delete `.gradle` directory
   - Update Gradle version in `gradle-wrapper.properties`

3. **Missing SDK components**
   - Open Android Studio
   - Go to Tools > SDK Manager
   - Install missing components

4. **Build configuration errors**
   - Check `app/build.gradle` for correct versions
   - Verify `gradle.properties` settings
   - Ensure all required dependencies are listed

## Version Information

- Gradle Version: 7.5.1
- Android Gradle Plugin: 7.3.1
- Compile SDK Version: 33
- Minimum SDK Version: 21
- Target SDK Version: 33

## Additional Resources

- [Android Developer Documentation](https://developer.android.com/docs)
- [Expo Android Build Guide](https://docs.expo.dev/build-reference/android-builds/)
- [Gradle Documentation](https://docs.gradle.org/current/userguide/userguide.html) 