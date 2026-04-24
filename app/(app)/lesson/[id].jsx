import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { fetchLessonById, createBooking } from '../../../services/api';
import AppButton from '../../../components/AppButton';
import Toast from 'react-native-toast-message';

export default function LessonDetails() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadLesson = async () => {
    try {
      const data = await fetchLessonById(id);
      setLesson(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadLesson();
  }, [id]);

  const handleBookLesson = async () => {
    if (bookingLoading) return;

    setBookingLoading(true);

    try {
      await createBooking(Number(id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Booking request sent!',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';

      if (message.includes('already booked')) {
        Toast.show({
          type: 'info',
          text1: 'Already booked',
          text2: 'You already booked this lesson.',
        });
        return;
      }

      if (message.includes('own lesson')) {
        Alert.alert('Not allowed', 'You cannot book your own lesson.');
        return;
      }

      if (message.includes('Only students')) {
        Alert.alert('Not allowed', 'Only students can book lessons.');
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Booking failed',
        text2: message,
      });
    } finally {
      setBookingLoading(false);
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
      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: '#1e293b',
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : lesson ? (
        <View
          style={{
            backgroundColor: '#111827',
            borderRadius: 16,
            padding: 18,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 26,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            {lesson.title}
          </Text>

          <Text style={{ color: '#cbd5e1', marginBottom: 10 }}>
            {lesson.description}
          </Text>

          <Text style={{ color: '#93c5fd', marginBottom: 6 }}>
            Category: {lesson.category}
          </Text>

          <Text style={{ color: '#facc15', marginBottom: 6 }}>
            Status: {lesson.status}
          </Text>

          <Text style={{ color: '#22c55e', fontSize: 16, fontWeight: 'bold' }}>
            {lesson.price_coins} coins
          </Text>

          <AppButton
            title={bookingLoading ? 'Booking...' : 'Book this lesson'}
            onPress={handleBookLesson}
            disabled={bookingLoading}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <Text style={{ color: 'white' }}>Lesson not found.</Text>
      )}
    </View>
  );
}