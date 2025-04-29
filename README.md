# ToDoListApp

A modern, cross-platform To-Do List application built with React Native and Expo, featuring Firebase integration for data persistence and real-time updates.

## Features

- Create, edit, and delete tasks
- Organize tasks with categories
- Real-time synchronization with Firebase
- Cross-platform support (iOS, Android, Web)
- Modern and intuitive user interface
- Offline support
- Push notifications (coming soon)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Java Development Kit (JDK 17 or later)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ToDoListApp.git
cd ToDoListApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Add your Firebase configuration to `firebaseConfig.js`

## Development

1. Start the development server:
```bash
npm start
```

2. Run on specific platforms:
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Building for Production

### Android APK

1. Configure the build:
```bash
eas build:configure
```

2. Build the APK:
```bash
eas build -p android --profile preview
```

### iOS

1. Configure the build:
```bash
eas build:configure
```

2. Build the app:
```bash
eas build -p ios --profile preview
```

## Project Structure

```
ToDoListApp/
├── assets/           # Images, fonts, and other static assets
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── android/          # Android-specific files
├── .expo/           # Expo configuration
├── App.js           # Main application component
├── firebaseConfig.js # Firebase configuration
├── index.js         # Entry point
├── app.json         # Expo configuration
├── eas.json         # EAS build configuration
└── package.json     # Dependencies and scripts
```

## Dependencies

- React Native
- Expo
- Firebase
- React Navigation
- Expo Vector Icons
- Expo Image Picker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the 0BSD License - see the LICENSE file for details.

## Support

For support, email [your-email@example.com] or open an issue in the repository.

## Acknowledgments

- Expo team for the amazing framework
- Firebase for backend services
- React Native community for continuous support 