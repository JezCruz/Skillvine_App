import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { fetchMyBookings } from '../../services/api';
import EmptyState from '../../components/EmptyState';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
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

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#020617',
        paddingTop: 60,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        My Bookings
      </Text>

      <Pressable
        onPress={() => router.replace('/home')}
        style={{
          backgroundColor: '#1e293b',
          padding: 10,
          borderRadius: 10,
          marginBottom: 20,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: 'white' }}>Back</Text>
      </Pressable>

      {error && (
        <View
          style={{
            backgroundColor: '#7f1d1d',
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: 'white', marginBottom: 8 }}>
            Cannot connect to server. Try again.
          </Text>

          <Pressable
            onPress={loadBookings}
            style={{
              backgroundColor: '#ef4444',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
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
                Price: {item.lesson_price} coins
              </Text>

              <Text style={{ color: '#facc15', marginTop: 6 }}>
                Status: {item.status}
              </Text>

              <Text style={{ color: '#64748b', marginTop: 6 }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}