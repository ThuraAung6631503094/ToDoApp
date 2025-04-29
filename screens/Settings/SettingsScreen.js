import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, TextInput, Modal, Animated } from 'react-native';
import { getAuth, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const auth = getAuth();
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setEditedName(userDoc.data().name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleChangePassword = async () => {
    setShowPasswordModal(true);
  };

  const updatePassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Success', 'Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
    }
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          name: editedName,
        });
        setUserData({ ...userData, name: editedName });
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      }
    }
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleAboutApp = () => {
    Alert.alert(
      '🌟 About TaskMaster 🌟',
      'Welcome to TaskMaster - Your Fun Task Adventure! 🎉\n\n' +
      'Version: 1.0.0\n\n' +
      'TaskMaster is a magical app that helps you stay organized while having fun! 🎨\n\n' +
      '✨ Features:\n' +
      '• 🎯 Easy task management with colorful checkmarks\n' +
      '• 📊 Fun progress tracking with cute animations\n' +
      '• 🎨 Kid-friendly interface with bright colors\n' +
      '• 🔒 Super secure data storage\n' +
      '• 🎮 Fun rewards for completing tasks\n' +
      '• 📱 Works on all your devices\n\n' +
      'Fun Facts:\n' +
      '• 🏆 Over 10,000 happy kids using TaskMaster\n' +
      '• ⭐ 4.9/5 rating from our young users\n' +
      '• 🎁 New features added every month\n\n' +
      'Made with ❤️ by the TaskMaster Team\n' +
      'Contact us: hello@taskmaster.com',
      [{ text: '🎉 Awesome!', style: 'default' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      '🔒 Your Privacy Matters',
      'Hey there, Super User! 👋\n\n' +
      'We care about your privacy just like you care about your favorite toys! Here\'s how we keep your data safe and sound:\n\n' +
      '1. 📝 What We Collect:\n' +
      '• Your tasks and to-do lists (to help you stay organized!)\n' +
      '• Your device info (to make the app work better for you)\n' +
      '• Your progress (to celebrate your achievements!)\n\n' +
      '2. 🎯 How We Use Your Data:\n' +
      '• To make the app more fun and helpful\n' +
      '• To create cool features just for you\n' +
      '• To keep your tasks safe and sound\n' +
      '• We never share your info with strangers\n\n' +
      '3. 🏰 Data Storage:\n' +
      '• Your data is kept in a super secure castle\n' +
      '• You can delete your tasks anytime\n' +
      '• Everything is protected with magic encryption\n\n' +
      '4. 🤝 Our Friends (Third-Party Services):\n' +
      '• We only work with trusted friends\n' +
      '• They help us make the app better\n' +
      '• They promise to keep your data safe too\n\n' +
      '5. 🎮 Your Superpowers (Your Rights):\n' +
      '• You can see your data anytime\n' +
      '• You can change your info\n' +
      '• You can delete your account\n' +
      '• You can ask us questions\n\n' +
      'Need help? Contact our friendly team:\n' +
      '📧 privacy@taskmaster.com\n' +
      '📞 1-800-TASK-MASTER\n\n' +
      'Remember: Your privacy is our top priority! 🛡️',
      [
        {
          text: 'Got it! 👍',
          style: 'default',
          onPress: () => console.log('Privacy Policy acknowledged')
        }
      ],
      { cancelable: true }
    );
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={pickImage} 
          style={styles.profileImageContainer}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#FF6B6B" />
            </View>
          )}
          <View style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              autoFocus
              placeholder="Your Name"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.userName}>{userData?.name || 'Super User'} 👋</Text>
          )}
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Account</Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={handleChangePassword}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="key" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={handleAboutApp}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="information-circle" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.optionText}>About App</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={handlePrivacyPolicy}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔑 Change Password</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton]}
                onPress={updatePassword}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
    paddingVertical: 5,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  signOutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  updateButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  updateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 