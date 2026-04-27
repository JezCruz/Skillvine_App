import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Pressable, Text, ActivityIndicator, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { logoutUser, fetchProfile, fetchAppVersion, getCurrentAppVersion } from '../../services/api';
import { isNewerVersion } from '../../utils/version';
import { useEffect, useState } from 'react';

import useRealtimeNotifications from '../../hooks/useRealtimeNotifications';

export default function AppLayout() {
  useRealtimeNotifications();
  
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        setRole(profile.role);
      } catch (err) {
        console.log(err);
        await logoutUser();
        router.replace('/');
      } finally {
        setLoadingRole(false);
      }
    };

    loadProfile();
    checkForUpdate();
    
  }, []);

  if (loadingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  const checkForUpdate = async () => {
    try {
      const currentVersion = getCurrentAppVersion();
      const data = await fetchAppVersion();

      if (isNewerVersion(data.latest_version, currentVersion)) {
        Alert.alert(
          "🚀 Update Available",
          `New version ${data.latest_version} is available`,
          [
            {
              text: "Later",
              style: "cancel"
            },
            {
              text: "Update Now",
              onPress: () => Linking.openURL(data.apk_url)
            }
          ]
        );
      }
    } catch (err) {
      console.log("Update check failed:", err);
    }
  };

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#111827' },
          drawerActiveTintColor: '#06b6d4',
          drawerInactiveTintColor: '#cbd5e1',
          headerRight: () =>
            role ? (
              <View
                style={{
                  backgroundColor: role === 'teacher' ? '#a78bfa' : '#38bdf8',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginRight: 12,
                }}
              >
                <Text style={{ color: '#000', fontWeight: 'bold' }}>
                  {role === 'teacher' ? 'Teacher' : 'Student'}
                </Text>
              </View>
            ) : null,
        }}
        drawerContent={(props) => {
          const handleLogout = async () => {
            await logoutUser();
            router.replace('/');
          };

          return (
            <DrawerContentScrollView {...props}>
              <DrawerItem
                label="Home"
                labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                onPress={() => router.push('/home')}
              />

              <DrawerItem
                label="Profile"
                labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                onPress={() => router.push('/profile')}
              />

              {role === 'student' && (
                <>
                  <DrawerItem
                    label="My Learning"
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    onPress={() => router.push('/learning')}
                  />

                  <DrawerItem
                    label="My Bookings"
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    onPress={() => router.push('/bookings')}
                  />
                </>
              )}

              {role === 'teacher' && (
                <>
                  <DrawerItem
                    label="Teacher Bookings"
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    onPress={() => router.push('/teacher-bookings')}
                  />

                  <DrawerItem
                    label="My Lessons"
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    onPress={() => router.push('/my-lessons')}
                  />

                  <DrawerItem
                    label="Create Lesson"
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    onPress={() => router.push('/create-lesson')}
                  />
                </>
              )}

              <View style={{ padding: 16 }}>
                <Pressable
                  onPress={handleLogout}
                  style={{
                    backgroundColor: '#ef4444',
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Logout
                  </Text>
                </Pressable>
              </View>
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen name="home" options={{ title: 'Home' }} />
        <Drawer.Screen name="profile" options={{ title: 'Profile' }} />
        <Drawer.Screen name="create-lesson" options={{ title: 'Create Lesson', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="learning" options={{ title: 'My Learning' }} />
        <Drawer.Screen name="bookings" options={{ title: 'My Bookings' }} />
        <Drawer.Screen name="teacher-bookings" options={{ title: 'Teacher Bookings' }} />
        <Drawer.Screen name="my-lessons" options={{ title: 'My Lessons' }} />
        <Drawer.Screen name="lesson/[id]" options={{ title: 'Lesson Details', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="lesson/[id]/edit" options={{ title: 'Edit Lesson', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="edit-profile" options={{ title: 'Edit Profile', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="updates" options={{ title: "Updates" }} />
      </Drawer>

      <StatusBar style="light" />
    </>
  );
}