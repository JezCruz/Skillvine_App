import { useEffect, useState } from 'react';
import { Text, Linking } from 'react-native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import { fetchAppVersion } from '../../services/api';

export default function Updates() {
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchAppVersion();
    setData(res);
  };

  if (!data) {
    return (
      <Screen>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, marginBottom: 12 }}>
        Latest Updates
      </Text>

      <Card>
        <Text style={{ color: '#22c55e', fontSize: 18 }}>
          Version: {data.latest_version}
        </Text>

        {data.notes?.map((note, index) => (
          <Text key={index} style={{ color: '#94a3b8', marginTop: 4 }}>
            • {note}
          </Text>
        ))}

        <AppButton
          title="Download Update"
          onPress={() => Linking.openURL(data.apk_url)}
          style={{ marginTop: 12 }}
        />
      </Card>
    </Screen>
  );
}