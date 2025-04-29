import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator, Animated, Platform, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const categories = {
  personal: { label: 'Personal', icon: 'person', color: '#FF6B6B' },
  work: { label: 'Work', icon: 'briefcase', color: '#4ECDC4' },
  shopping: { label: 'Shopping', icon: 'cart', color: '#FFD166' },
  health: { label: 'Health', icon: 'fitness', color: '#06D6A0' },
  other: { label: 'Other', icon: 'apps', color: '#A78BFA' },
};

const filterOptions = [
  { id: 'all', label: 'All', icon: 'apps', color: '#888' },
  ...Object.entries(categories).map(([id, cat]) => ({ id, ...cat })),
  { id: 'completed', label: 'Completed', icon: 'checkmark-done', color: '#06D6A0' },
];

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || 'Super User');
        }
      } catch (error) {
        setUserName('Super User');
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksArr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !currentStatus,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'tasks', id));
            console.log('Task deleted:', id);
            Alert.alert('Success', 'Task deleted!');
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Failed to delete task: ' + error.message);
          }
        }
      }
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter tasks by selected category
  let filteredTasks = tasks;
  if (selectedFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (selectedFilter === 'all') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else {
    filteredTasks = tasks.filter(task => task.category === selectedFilter && !task.completed);
  }

  const renderTask = ({ item }) => {
    const cat = categories[item.category] || categories.other;
    const isCompleted = item.completed;
    return (
      <View style={[styles.taskCard, { borderLeftColor: cat.color, opacity: isCompleted ? 0.5 : 1 }]}> 
        <View style={styles.taskCardHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: cat.color + '22' }]}> 
            <Ionicons name={cat.icon} size={22} color={cat.color} />
          </View>
          <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
          {isCompleted && (
            <Ionicons name="checkmark-done-circle" size={22} color="#06D6A0" style={{ marginLeft: 8 }} />
          )}
        </View>
        <Text style={[styles.taskTitle, isCompleted && styles.completedTaskTitle]}>{item.title}</Text>
        {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
        <View style={styles.taskActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('EditTask', { task: item })}>
            <Ionicons name="create" size={20} color="#4ECDC4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={async () => {
            try {
              await deleteDoc(doc(db, 'tasks', item.id));
              Alert.alert('Success', 'Task deleted!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task: ' + error.message);
              console.error('Delete error:', error);
            }
          }}>
            <Ionicons name="trash" size={20} color="#FF6B6B" />
          </TouchableOpacity>
          {!isCompleted && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => toggleTaskStatus(item.id, item.completed)}>
              <Ionicons name="checkmark-done" size={20} color="#06D6A0" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Playful Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="emoticon-cool" size={38} color="#FFD166" style={{ marginRight: 10 }} />
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{userName} <Text style={{ fontSize: 22 }}>👋</Text></Text>
        </View>
      </View>

      {/* Filter Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        {filterOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.filterBtn, selectedFilter === option.id && { backgroundColor: option.color + '22', borderColor: option.color }]}
            onPress={() => setSelectedFilter(option.id)}
            activeOpacity={0.8}
          >
            <Ionicons name={option.icon} size={20} color={selectedFilter === option.id ? option.color : '#888'} />
            <Text style={[styles.filterLabel, { color: selectedFilter === option.id ? option.color : '#888' }]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <View style={styles.taskListContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 40 }} />
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="star-face" size={60} color="#FFD166" />
            <Text style={styles.emptyText}>No tasks yet! Tap the + to add your first adventure!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <Animated.View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddTask')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Motivational Message */}
      <View style={styles.mascotContainer}>
        <Text style={styles.mascotText}>🌟 Keep going, you're awesome!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userName: {
    fontSize: 26,
    color: '#FFD166',
    fontWeight: 'bold',
  },
  filterBar: {
    marginTop: 2,
    marginBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 54,
    maxHeight: 54,
  },
  filterBarContent: {
    alignItems: 'center',
    paddingRight: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  taskListContainer: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    marginTop: 2,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
    marginTop: 2,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  actionBtn: {
    marginLeft: 12,
    backgroundColor: '#FFF6F6',
    borderRadius: 10,
    padding: 7,
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  fabContainer: {
    position: 'absolute',
    right: 28,
    bottom: 90,
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    backgroundColor: '#FF6B6B',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 30 : 18,
    marginTop: 8,
  },
  mascotText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 