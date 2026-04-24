import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { loginUser, getStoredToken } from '../../services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = await getStoredToken();

        if (!mounted) return;

        if (token) {
          router.replace('/home');
          return;
        }
      } catch (error) {
        console.log('Auth check error:', error);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Enter username and password');
      return;
    }

    try {
      setLoading(true);
      await loginUser(username, password);
      router.replace('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
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

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
    </TouchableWithoutFeedback>
  );
}