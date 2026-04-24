import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { fetchLessons, fetchProfile } from '../../services/api';
import { router } from 'expo-router';

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadData = async () => {
    try {
      const lessonsData = await fetchLessons();
      const profileData = await fetchProfile();

      setLessons(lessonsData);
      setRole(profileData.role);
      setProfile(profileData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#020617',
        paddingTop: 20,
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

      {profile && (
        <Text style={{ color: '#22c55e', marginBottom: 16 }}>
          Coins: {profile.coins}
        </Text>
      )}

      {role === 'student' && (
        <Pressable
          onPress={() => router.push('/bookings')}
          style={{
            backgroundColor: '#1e293b',
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: 'white' }}>My Bookings</Text>
        </Pressable>
      )}

      {role === 'teacher' && (
        <Pressable
          onPress={() => router.push('/teacher-bookings')}
          style={{
            backgroundColor: '#1e293b',
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: 'white' }}>Teacher Bookings</Text>
        </Pressable>
      )}

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