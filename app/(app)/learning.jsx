import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { fetchMyEnrollments } from '../../services/api';

export default function Learning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEnrollments();
    setRefreshing(false);
  };

  const loadEnrollments = async () => {
    try {
      const data = await fetchMyEnrollments();
      setEnrollments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        My Learning
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : enrollments.length === 0 ? (
        <Text style={{ color: '#94a3b8' }}>No enrolled lessons yet.</Text>
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={enrollments}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#111827',
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                {item.lesson_title}
              </Text>

              <Text style={{ color: '#cbd5e1', marginTop: 6 }}>
                Teacher: {item.teacher_username}
              </Text>

              <Text style={{ color: '#22c55e', marginTop: 6 }}>
                Status: {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}