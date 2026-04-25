import { useEffect, useState } from 'react';
import { Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { fetchMyLessons } from '../../services/api';
import AppButton from '../../components/AppButton';

export default function MyLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLessons = async () => {
    try {
      const data = await fetchMyLessons();
      setLessons(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed to load lessons',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLessons();
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
        My Lessons
      </Text>

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons yet"
          subtitle="Create your first lesson to start receiving bookings."
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

                <Text style={{ color: '#facc15', marginTop: 6 }}>
                  Status: {item.status}
                </Text>

                <AppButton
                  title="Edit Lesson"
                  onPress={() => router.push(`/lesson/${item.id}/edit`)}
                  variant="secondary"
                  style={{ marginTop: 12 }}
                />
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}