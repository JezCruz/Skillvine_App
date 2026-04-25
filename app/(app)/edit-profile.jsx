import { useEffect, useState } from 'react';
import { Text, TextInput, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import { fetchProfile, updateProfile } from '../../services/api';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      setUsername(data.username || '');
      setEmail(data.email || '');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!username || !email) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Username and email are required.',
      });
      return;
    }

    try {
      setSaving(true);
      await updateProfile(username, email);

      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Profile updated successfully.',
      });

      router.replace('/profile');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#06b6d4" />
      </Screen>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
          Edit Profile
        </Text>

        <Card>
          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={inputStyle}
          />

          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
          />

          <AppButton
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
            style={{ marginTop: 8 }}
          />

          <AppButton
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            style={{ marginTop: 10 }}
          />
        </Card>
      </Screen>
    </TouchableWithoutFeedback>
  );
}

const inputStyle = {
  backgroundColor: '#1e293b',
  color: 'white',
  padding: 14,
  borderRadius: 12,
  marginBottom: 14,
};