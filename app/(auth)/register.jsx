import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { registerUser } from '../../services/api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !password2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    try {
      setLoading(true);

      await registerUser(username, email, password, password2);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created! You can now login.',
      });

      router.replace('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';

      Toast.show({
        type: 'error',
        text1: 'Register failed',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#020617',
        }}
      >
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
          Create Account
        </Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          style={inputStyle}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          style={inputStyle}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={inputStyle}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
          style={inputStyle}
        />

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#64748b' : '#06b6d4',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>
            {loading ? 'Creating...' : 'Register'}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const inputStyle = {
  backgroundColor: '#1e293b',
  color: 'white',
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
};