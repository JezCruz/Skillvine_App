import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  fetchTeacherBookings,
  updateBookingStatus,
} from '../../services/api';

export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await fetchTeacherBookings();
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      Alert.alert('Success', `Booking ${status}`);

      // reload list
      loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      Alert.alert('Error', message);
    }
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
        Teacher Bookings
      </Text>

      <Pressable
        onPress={() => router.back()}
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

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : bookings.length === 0 ? (
        <Text style={{ color: '#94a3b8' }}>No bookings yet.</Text>
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
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Lesson ID: {item.lesson}
              </Text>

              <Text style={{ color: '#cbd5e1', marginTop: 6 }}>
                Status: {item.status}
              </Text>

              {/* buttons */}
              {item.status === 'pending' && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Pressable
                    onPress={() => handleUpdate(item.id, 'approved')}
                    style={{
                      backgroundColor: '#22c55e',
                      padding: 10,
                      borderRadius: 8,
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>
                      Approve
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleUpdate(item.id, 'declined')}
                    style={{
                      backgroundColor: '#ef4444',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      Decline
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