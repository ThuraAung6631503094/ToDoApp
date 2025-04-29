import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert, TouchableWithoutFeedback, Animated } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const categories = [
  { id: 'personal', label: 'Personal', icon: 'person', color: '#FF6B6B' },
  { id: 'work', label: 'Work', icon: 'briefcase', color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', icon: 'cart', color: '#FFD166' },
  { id: 'health', label: 'Health', icon: 'fitness', color: '#06D6A0' },
  { id: 'other', label: 'Other', icon: 'apps', color: '#A78BFA' },
];

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [buttonAnim] = useState(new Animated.Value(1));
  const auth = getAuth();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Oops!', 'Please add a title for your task');
      return;
    }
    if (!auth.currentUser) {
      Alert.alert('Error', 'You need to be logged in to add tasks');
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: title.trim(),
        description: description.trim(),
        completed: false,
        category: selectedCategory.id,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonAnim, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Fun Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FF6B6B" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="rocket-launch" size={32} color="#FF6B6B" style={{ marginRight: 10 }} />
          <Text style={styles.title}>Add New Task</Text>
        </View>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="pencil" size={22} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="What's your task?"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity 
            style={[
              styles.categoryButton,
              { borderColor: selectedCategory.color }
            ]}
            onPress={() => setShowCategoryDropdown(true)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryButtonContent}>
              <View style={[styles.categoryIconContainer, { backgroundColor: selectedCategory.color + '20' }]}>
                <Ionicons name={selectedCategory.icon} size={24} color={selectedCategory.color} />
              </View>
              <Text style={[styles.categoryButtonText, { color: selectedCategory.color }]}>
                {selectedCategory.label}
              </Text>
            </View>
            <Ionicons 
              name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={selectedCategory.color} 
            />
          </TouchableOpacity>

          {/* Modal Dropdown for Category Selection */}
          <Modal
            visible={showCategoryDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCategoryDropdown(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowCategoryDropdown(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalDropdownContainer}>
                  <Text style={styles.dropdownTitle}>Pick a Category!</Text>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.dropdownItem,
                        selectedCategory.id === category.id && styles.selectedItem,
                      ]}
                      onPress={() => handleCategorySelect(category)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                        <Ionicons name={category.icon} size={24} color={category.color} />
                      </View>
                      <Text style={[styles.dropdownItemText, { color: category.color }]}>
                        {category.label}
                      </Text>
                      {selectedCategory.id === category.id && (
                        <Ionicons name="checkmark-circle" size={22} color={category.color} style={{ marginLeft: 8 }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Add some details..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Add Task Button */}
        <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.disabledButton]}
            onPress={() => { animateButton(); handleAddTask(); }}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="star-face" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>
              {isLoading ? 'Adding...' : 'Add Task'}
            </Text>
            <Ionicons name="add-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Motivational Mascot/Emoji */}
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotText}>🚀 You can do it! Every task is an adventure!</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B6B',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  inputContainer: {
    margin: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFD6D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  // Modal overlay and dropdown styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 0,
    minWidth: 260,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#FFF5F5',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: 'linear-gradient(90deg, #FF6B6B 60%, #FFD166 100%)',
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  mascotText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 