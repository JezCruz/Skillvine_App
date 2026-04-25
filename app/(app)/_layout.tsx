import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { logoutUser, fetchProfile } from '../../services/api';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        setRole(profile.role);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRole(false);
      }
    };

    loadProfile();
  }, []);

  if (loadingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#fff',

          headerRight: () => (
            role && (
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
            )
          ),
          drawerStyle: { backgroundColor: '#111827' },
          drawerActiveTintColor: '#06b6d4',
          drawerInactiveTintColor: '#cbd5e1',
        }}
        drawerContent={(props) => {
          const handleLogout = async () => {
            await logoutUser();
            router.replace('/');
          };

          const filteredRoutes = props.state.routes.filter((route) => {
            if (role === 'student') {
              return !['teacher-bookings', 'my-lessons', 'create-lesson'].includes(route.name);
            }

            if (role === 'teacher') {
              return !['bookings', 'learning'].includes(route.name);
            }

            return true;
          });

          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList
                {...props}
                state={{
                  ...props.state,
                  routes: filteredRoutes,
                  routeNames: filteredRoutes.map((route) => route.name),
                }}
              />

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
        <Drawer.Screen name="edit-profile" options={{ title: 'Edit Profile', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="lesson/[id]/edit" options={{ title: 'Edit Lesson', drawerItemStyle: { display: 'none' } }} />
      </Drawer>

      <StatusBar style="light" />
    </>
  );
}