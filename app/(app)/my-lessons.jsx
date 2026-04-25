import { useEffect, useState } from 'react';
import { Text, FlatList, ActivityIndicator, Pressable, Alert, View } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import { fetchMyLessons, deleteLesson } from '../../services/api';

export default function MyLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadLessons = async () => {
    try {
      setError(null);
      const data = await fetchMyLessons();
      setLessons(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
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

  const handleDelete = (id, title) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLesson(id);

              Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Lesson removed successfully.',
              });

              loadLessons();
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Delete failed',
                text2: err instanceof Error ? err.message : 'Something went wrong',
              });
            }
          },
        },
      ]
    );
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

          <AppButton title="Retry" onPress={loadLessons} variant="danger" />
        </View>
      )}

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

                <AppButton
                  title="Delete Lesson"
                  onPress={() => handleDelete(item.id, item.title)}
                  variant="danger"
                  style={{ marginTop: 10 }}
                />
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}