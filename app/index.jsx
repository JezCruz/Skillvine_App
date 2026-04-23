import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { loginUser } from '../services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Enter username and password');
      return;
    }

    try {
      setLoading(true);
      await loginUser(username, password);
      Alert.alert('Success', 'Logged in!');
    } catch (err) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#0f172a',
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 20,
        }}
      >
        Skillvine Login
      </Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: '#06b6d4',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>
    </View>
  );
}