import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { loginUser } from '../../services/api';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      router.replace('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      Alert.alert("Error", message);
    }
  };

  return (
  <View style={{
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a'
  }}>
    
    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20
    }}>
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
        marginBottom: 10
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
        marginBottom: 15
      }}
    />

    <Pressable
      onPress={handleLogin}
      style={{
        backgroundColor: '#06b6d4',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: '#000', fontWeight: 'bold' }}>
        Login
      </Text>
    </Pressable>

  </View>
);
}