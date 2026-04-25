import { useEffect, useState } from 'react';
import { Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../../components/Screen';
import Card from '../../../components/Card';
import AppButton from '../../../components/AppButton';
import { fetchLessonById, createBooking } from '../../../services/api';

export default function LessonDetails() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadLesson = async () => {
    try {
      const data = await fetchLessonById(id);
      setLesson(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed to load lesson',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadLesson();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLesson();
    setRefreshing(false);
  };

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
        Toast.show({
          type: 'error',
          text1: 'Not allowed',
          text2: 'You cannot book your own lesson.',
        });
        return;
      }

      if (message.includes('Only students')) {
        Toast.show({
          type: 'error',
          text1: 'Not allowed',
          text2: 'Only students can book lessons.',
        });
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

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#06b6d4" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />
        }
      >
        <AppButton
          title="Back"
          onPress={() => router.back()}
          variant="secondary"
          style={{ alignSelf: 'flex-start', marginBottom: 20 }}
        />

        {lesson ? (
          <Card>
            <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 10 }}>
              {lesson.title}
            </Text>

            <Text style={{ color: '#cbd5e1', marginBottom: 12 }}>
              {lesson.description || 'No description'}
            </Text>

            <Text style={{ color: '#93c5fd', marginBottom: 6 }}>
              Category: {lesson.category}
            </Text>

            <Text style={{ color: '#facc15', marginBottom: 6 }}>
              Status: {lesson.status}
            </Text>

            <Text style={{ color: '#38bdf8', marginBottom: 6 }}>
              Teacher: {lesson.teacher_username}
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
          </Card>
        ) : (
          <Text style={{ color: 'white' }}>Lesson not found.</Text>
        )}
      </ScrollView>
    </Screen>
  );
}