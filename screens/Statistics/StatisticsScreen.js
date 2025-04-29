import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
  });

  const auth = getAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data());
      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;
      const pending = total - completed;
      const rate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        completionRate: rate,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Statistics</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="list" size={40} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time" size={40} color="#FFA726" />
          <Text style={styles.statNumber}>{stats.pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={40} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.completionRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Task Completion Progress</Text>
          <Text style={styles.progressPercentage}>{stats.completionRate.toFixed(1)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${stats.completionRate}%` }
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
}); 