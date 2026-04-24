import { fetchTeacherBookings, updateBookingStatus } from '../../services/api';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';


export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    try {
      const data = await fetchTeacherBookings();
      setBookings(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error';
      Alert.alert('Error', msg);
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
      Alert.alert('Success', `Booking ${status}`);
      loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      Alert.alert('Error', message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Teacher Bookings
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : (
        <FlatList
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
                <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                  <Pressable
                    onPress={() => handleUpdate(item.id, 'approved')}
                    style={{
                      backgroundColor: '#22c55e',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Approve</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleUpdate(item.id, 'declined')}
                    style={{
                      backgroundColor: '#ef4444',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Decline</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleUpdate(item.id, 'approved')}
                    disabled={updatingId === item.id}
                    style={{
                      backgroundColor: updatingId === item.id ? '#64748b' : '#22c55e',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>
                      {updatingId === item.id ? 'Updating...' : 'Approve'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleUpdate(item.id, 'declined')}
                    disabled={updatingId === item.id}
                    style={{
                      backgroundColor: updatingId === item.id ? '#64748b' : '#ef4444',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {updatingId === item.id ? 'Updating...' : 'Decline'}
                    </Text>
                  </Pressable>
                  
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}