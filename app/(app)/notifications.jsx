import { useEffect, useState } from 'react';
import { Text, FlatList, Pressable } from 'react-native';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';

import { fetchNotifications, markNotificationRead } from '../../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  if (notifications.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No notifications"
          subtitle="You're all caught up!"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, marginBottom: 12 }}>
        Notifications
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleRead(item.id)}>
            <Card
              style={{
                backgroundColor: item.is_read ? '#1e293b' : '#0ea5e9',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                {item.title}
              </Text>

              <Text style={{ color: '#cbd5e1', marginTop: 4 }}>
                {item.message}
              </Text>

              <Text style={{ color: '#94a3b8', marginTop: 6, fontSize: 12 }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}