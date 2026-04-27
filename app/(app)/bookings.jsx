import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, FlatList, ActivityIndicator } from 'react-native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import { fetchMyBookings } from '../../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBookings = async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();

      const timer = setInterval(() => {
        loadBookings();
      }, 10000);

      return () => clearInterval(timer);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
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
        My Bookings
      </Text>

      {error ? (
        <Card style={{ backgroundColor: '#7f1d1d' }}>
          <Text style={{ color: 'white', marginBottom: 10 }}>
            Cannot connect to server. Try again.
          </Text>

          <AppButton
            title="Retry"
            onPress={() => loadBookings({ showLoading: true })}
            variant="danger"
          />
        </Card>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          subtitle="Book a lesson first, then it will appear here."
        />
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={bookings}
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
                Price: {item.lesson_price} coins
              </Text>

              <Text style={{ color: '#facc15', marginTop: 6 }}>
                Status: {item.status}
              </Text>

              <Text style={{ color: '#64748b', marginTop: 6 }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}