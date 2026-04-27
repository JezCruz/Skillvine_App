import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Linking } from 'react-native';
import * as Application from 'expo-application';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import { fetchAppVersion } from '../../services/api';

export default function Updates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentVersion = Application.nativeApplicationVersion || "1.0.0";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAppVersion();
        setData(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#06b6d4" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
        App Updates
      </Text>

      <Card>
        <Text style={{ color: '#94a3b8' }}>Current Version</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>{currentVersion}</Text>

        <Text style={{ color: '#94a3b8', marginTop: 12 }}>Latest Version</Text>
        <Text style={{ color: '#22c55e', fontSize: 18 }}>{data.latest_version}</Text>
      </Card>

      <Card>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
          What's New
        </Text>

        {data.notes?.map((note, index) => (
          <Text key={index} style={{ color: '#cbd5e1', marginBottom: 6 }}>
            • {note}
          </Text>
        ))}
      </Card>

      <Pressable
        onPress={() => Linking.openURL(data.apk_url)}
        style={{
          backgroundColor: '#06b6d4',
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000', fontWeight: 'bold' }}>
          Download Update
        </Text>
      </Pressable>
    </Screen>
  );
}