import { Stack, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getStoredToken } from '../services/api';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getStoredToken();
      const inAuthGroup = segments[0] === '(auth)';

      if (token && inAuthGroup) {
        router.replace('/home');
      }

      if (!token && !inAuthGroup) {
        router.replace('/');
      }

      setLoading(false);
    };

    checkAuth();
  }, [segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#020617',
        }}
      >
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}