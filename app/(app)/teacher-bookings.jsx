import { fetchTeacherBookings, updateBookingStatus } from '../../services/api';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AppButton from '../../components/AppButton';
import Toast from 'react-native-toast-message';
import EmptyState from '../../components/EmptyState';

export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const loadBookings = async () => {
    try {
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

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdate = async (id, status) => {
    if (updatingId) return;

    setUpdatingId(id);

    try {
      await updateBookingStatus(id, status);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: status === 'approved'
          ? 'Student has been approved'
          : 'Booking declined',
      });
      loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Teacher Bookings
      </Text>

      {error && (
        <View style={{ backgroundColor: '#7f1d1d', padding: 12, borderRadius: 10, marginBottom: 12 }}>
          <Text style={{ color: 'white', marginBottom: 8 }}>
            Cannot connect to server. Try again.
          </Text>

          <AppButton
            title="Retry"
            onPress={loadBookings}
            variant="danger"
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
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
                Student: {item.student_username}
              </Text>

              <Text style={{ color: '#22c55e', marginTop: 6 }}>
                Price: {item.lesson_price} coins
              </Text>

              <Text style={{ color: '#facc15', marginTop: 6 }}>
                Status: {item.status}
              </Text>

              {item.status === 'pending' && (

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
            </View>
          )}
        />
      )}
    </View>
  );
}