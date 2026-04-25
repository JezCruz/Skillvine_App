import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator} from 'react-native';
import { fetchMyEnrollments } from '../../services/api';
import AppButton from '../../components/AppButton';
import EmptyState from '../../components/EmptyState';

export default function Learning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEnrollments();
    setRefreshing(false);
  };

  const loadEnrollments = async () => {
    try {
      setError(null);
      const data = await fetchMyEnrollments();
      setEnrollments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
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

      {error && (
        <View style={{ backgroundColor: '#7f1d1d', padding: 12, borderRadius: 10, marginBottom: 12 }}>
          <Text style={{ color: 'white', marginBottom: 8 }}>
            Cannot connect to server. Try again.
          </Text>

          <AppButton
            title="Retry"
            onPress={loadEnrollments}
            variant="danger"
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : enrollments.length === 0 ? (
        <EmptyState
          title="No enrolled lessons yet"
          subtitle="Approved lessons will appear here after a teacher accepts your booking."
        />
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