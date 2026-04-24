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
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };

  const handleRegister = async () => {

    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    const strength = getPasswordStrength(password);

    if (strength === 'weak') {
      Toast.show({
        type: 'error',
        text1: 'Weak password',
        text2: 'Use at least 8 chars, uppercase, number, or symbol.',
      });
      return;
    }

    if (password !== password2) {
      Toast.show({
        type: 'error',
        text1: 'Password mismatch',
        text2: 'Passwords do not match.',
      });
      return;
    }

    if (!username || !password || !password2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    if (!role) {
        Toast.show({
            type: 'error',
            text1: 'Role required',
            text2: 'Please choose Student or Teacher.',
        });
        return;
    }

    try {
      setLoading(true);

      await registerUser(username, email, password, password2, role);

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

  const strength = getPasswordStrength(password);
  const canRegister =
    username &&
    password &&
    password2 &&
    role &&
    email &&
    isValidEmail(email) &&
    password === password2 &&
    strength !== 'weak' &&
    !loading;

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
        {email.length > 0 && (
          <Text
            style={{
              marginBottom: 12,
              color: isValidEmail(email) ? '#22c55e' : '#ef4444',
            }}
          >
            {isValidEmail(email)
              ? 'Valid email'
              : 'Invalid email'}
          </Text>
        )}

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            style={[inputStyle, { paddingRight: 50 }]}
          />

          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 14, top: 14 }}
          >
            <Text style={{ color: 'white' }}>{showPassword ? '🙈' : '👁'}</Text>
          </Pressable>
        </View>

        {password.length > 0 && (
          <Text
            style={{
              marginBottom: 12,
              color:
                getPasswordStrength(password) === 'weak'
                  ? '#ef4444'
                  : getPasswordStrength(password) === 'medium'
                  ? '#facc15'
                  : '#22c55e',
            }}
          >
            {getPasswordStrength(password) === 'weak'
              ? 'Weak 🔴'
              : getPasswordStrength(password) === 'medium'
              ? 'Medium 🟡'
              : 'Strong 🟢'}
          </Text>
        )}

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showConfirm}
            value={password2}
            onChangeText={setPassword2}
            autoCapitalize="none"
            style={[inputStyle, { paddingRight: 50 }]}
          />

          <Pressable
            onPress={() => setShowConfirm(!showConfirm)}
            style={{ position: 'absolute', right: 14, top: 14 }}
          >
            <Text style={{ color: 'white' }}>{showConfirm ? '🙈' : '👁'}</Text>
          </Pressable>
        </View>

        {password2.length > 0 && (
          <Text
            style={{
              marginBottom: 12,
              color: password === password2 ? '#22c55e' : '#ef4444',
            }}
          >
            {password === password2
              ? 'Passwords match ✅'
              : 'Passwords do not match ❌'}
          </Text>
        )}

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <Pressable
                onPress={() => setRole('student')}
                style={{
                flex: 1,
                backgroundColor: role === 'student' ? '#06b6d4' : '#1e293b',
                borderWidth: 1,
                borderColor: role === 'student' ? '#ffffff' : '#334155',
                padding: 12,
                borderRadius: 10,
                marginRight: 8,
                alignItems: 'center',
                }}
            >
                <Text style={{ color: role === 'student' ? '#000' : '#fff', fontWeight: 'bold' }}>
                Student
                </Text>
            </Pressable>

            <Pressable
                onPress={() => setRole('teacher')}
                style={{
                flex: 1,
                backgroundColor: role === 'teacher' ? '#06b6d4' : '#1e293b',
                borderWidth: 1,
                borderColor: role === 'teacher' ? '#ffffff' : '#334155',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
                }}
            >
                <Text style={{ color: role === 'teacher' ? '#000' : '#fff', fontWeight: 'bold' }}>
                Teacher
                </Text>
            </Pressable>
        </View>

        <Pressable
          onPress={handleRegister}
          disabled={!canRegister}
          style={{
            backgroundColor: !canRegister ? '#3e4d63' : '#06b6d4', borderWidth: 0.5, borderColor: '#ffffff',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            opacity: !canRegister ? 0.7 : 1,
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