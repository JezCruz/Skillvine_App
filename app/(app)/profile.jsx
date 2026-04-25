import { useEffect, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import { fetchProfile } from '../../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#06b6d4" />
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <Text style={{ color: 'white' }}>No profile data</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        Profile
      </Text>

      <Card>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
          👤 {profile.username}
        </Text>

        <Text style={{ color: '#94a3b8', marginBottom: 12 }}>
          📧 {profile.email}
        </Text>

        {/* ROLE BADGE */}
        <Text
          style={{
            alignSelf: 'flex-start',
            backgroundColor: profile.role === 'teacher' ? '#a78bfa' : '#06b6d4',
            color: '#000',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          {profile.role.toUpperCase()}
        </Text>

        {/* COINS */}
        <Text
          style={{
            color: '#22c55e',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          💰 {profile.coins || 0} coins
        </Text>
      </Card>
    </Screen>
  );
}