import { useState, useCallback } from 'react';
import { Text, FlatList, ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import { fetchTeacherBookings, updateBookingStatus } from '../../services/api';

export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBookings = async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await fetchTeacherBookings();
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

  const handleUpdate = async (id, status) => {
    if (updatingId) return;

    setUpdatingId(id);

    try {
      await updateBookingStatus(id, status);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: status === 'approved' ? 'Student has been approved' : 'Booking declined',
      });

      await loadBookings();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setUpdatingId(null);
    }
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
        Teacher Bookings
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
          title="No booking requests"
          subtitle="When students book your lessons, requests will appear here."
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
                Student: {item.student_username}
              </Text>

              <Text style={{ color: '#22c55e', marginTop: 6 }}>
                Price: {item.lesson_price} coins
              </Text>

              <Text style={{ color: '#facc15', marginTop: 6 }}>
                Status: {item.status}
              </Text>

              {item.status === 'pending' && (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <AppButton
                    title={updatingId === item.id ? 'Updating...' : 'Approve'}
                    onPress={() => handleUpdate(item.id, 'approved')}
                    disabled={updatingId === item.id}
                    variant="success"
                    style={{ flex: 1, marginRight: 8 }}
                  />

                  <AppButton
                    title={updatingId === item.id ? 'Updating...' : 'Decline'}
                    onPress={() => handleUpdate(item.id, 'declined')}
                    disabled={updatingId === item.id}
                    variant="danger"
                    style={{ flex: 1 }}
                  />
                </View>
              )}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}