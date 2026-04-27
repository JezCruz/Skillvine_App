import { useState, useCallback } from 'react';
import { Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import EmptyState from '../../components/EmptyState';
import { fetchLessons, fetchProfile } from '../../services/api';

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const lessonsData = await fetchLessons();
      const profileData = await fetchProfile();

      setLessons(lessonsData);
      setProfile(profileData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();

      const timer = setInterval(() => {
        loadData();
      }, 10000); // every 10 seconds

      return () => clearInterval(timer);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
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
      <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 7 }}>
        Skillvine Lessons
      </Text>

      {profile?.role === 'student' && (
        <AppButton
          title="My Bookings"
          onPress={() => router.push('/bookings')}
          variant="secondary"
          style={{ marginBottom: 12 }}
        />
      )}

      {profile?.role === 'teacher' && (
        <>
          <AppButton
            title="Teacher Bookings"
            onPress={() => router.push('/teacher-bookings')}
            variant="secondary"
            style={{ marginBottom: 12 }}
          />

          <AppButton
            title="Create Lesson"
            onPress={() => router.push('/create-lesson')}
            style={{ marginBottom: 16 }}
          />
        </>
      )}

      {error ? (
        <Card style={{ backgroundColor: '#7f1d1d' }}>
          <Text style={{ color: 'white', marginBottom: 10 }}>
            Cannot connect to server. Try again.
          </Text>

          <AppButton
            title="Retry"
            onPress={() => loadData({ showLoading: true })}
            variant="danger"
          />
        </Card>
      ) : lessons.length === 0 ? (
        <EmptyState
          title="No lessons available"
          subtitle="Active lessons will appear here once teachers publish them."
        />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/lesson/${item.id}`)}>
              <Card>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  {item.title}
                </Text>

                <Text style={{ color: '#94a3b8', marginTop: 6 }}>
                  {item.description || 'No description'}
                </Text>

                <Text style={{ color: '#22c55e', marginTop: 6 }}>
                  {item.price_coins} coins
                </Text>

                <Text style={{ color: '#38bdf8', marginTop: 6 }}>
                  Teacher: {item.teacher_username}
                </Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}