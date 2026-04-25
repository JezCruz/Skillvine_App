import { useEffect, useState } from 'react';
import { Text, FlatList, ActivityIndicator } from 'react-native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import { fetchMyEnrollments } from '../../services/api';

export default function Learning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEnrollments = async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) setLoading(true);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEnrollments();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#06b6d4" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        My Learning
      </Text>

      {error ? (
        <Card style={{ backgroundColor: '#7f1d1d' }}>
          <Text style={{ color: 'white', marginBottom: 10 }}>
            Cannot connect to server. Try again.
          </Text>

          <AppButton
            title="Retry"
            onPress={() => loadEnrollments({ showLoading: true })}
            variant="danger"
          />
        </Card>
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
            <Card>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                {item.lesson_title}
              </Text>

              <Text style={{ color: '#cbd5e1', marginTop: 6 }}>
                Teacher: {item.teacher_username}
              </Text>

              <Text style={{ color: '#22c55e', marginTop: 6 }}>
                Status: {item.status}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}