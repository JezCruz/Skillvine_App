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
  KeyboardAvoidingView,
  Platform,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#020617',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8,
          }}
        >
          Skillvine
        </Text>

        <Text
          style={{
            color: '#94a3b8',
            marginBottom: 24,
          }}
        >
          Login to continue
        </Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={{
            backgroundColor: '#1e293b',
            color: 'white',
            padding: 14,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          style={{
            backgroundColor: '#1e293b',
            color: 'white',
            padding: 14,
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#64748b' : '#06b6d4',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/register')}>
          <Text style={{ color: '#38bdf8', marginTop: 16 }}>
            {"Don't have an account? Register"}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}