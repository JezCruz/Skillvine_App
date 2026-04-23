import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { fetchLessons } from '../services/api';
import { router } from 'expo-router';

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    try {
      const data = await fetchLessons();
      setLessons(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

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
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Skillvine Lessons
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/lesson/${item.id}`)}
            android_ripple={{ color: '#1f2937' }}
            style={({ pressed }) => ({
                backgroundColor: '#111827',
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                opacity: pressed ? 0.85 : 1,
            })}
            >
            <Text
            style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 6,
            }}
            >
            {item.title}
            </Text>

            <Text style={{ color: '#cbd5e1', marginBottom: 6 }}>
            {item.description}
            </Text>

            <Text style={{ color: '#22c55e' }}>
            {item.price_coins} coins
            </Text>
          </Pressable>
          )}
        />
      )}
    </View>
  );
}