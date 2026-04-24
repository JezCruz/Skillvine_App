import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { fetchProfile } from '../../services/api';
import Screen from '../../components/Screen';
import Card from '../../components/Card';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        Profile
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#06b6d4" />
      ) : profile ? (
        <View style={{ backgroundColor: '#111827', padding: 18, borderRadius: 16 }}>
          <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
            Username: {profile.username}
          </Text>

          <Text style={{ color: '#cbd5e1', marginBottom: 10 }}>
            Email: {profile.email}
          </Text>

          <Text style={{ color: '#93c5fd', marginBottom: 10 }}>
            Role: {profile.role}
          </Text>

          <Text style={{ color: '#22c55e', fontSize: 18, fontWeight: 'bold' }}>
            Coins: {profile.coins}
          </Text>
        </View>
      ) : (
        <Text style={{ color: 'white' }}>No profile data</Text>
      )}
    </Screen>
  );
}