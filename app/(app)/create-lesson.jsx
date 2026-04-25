import { useState } from 'react';
import { Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import { createLesson } from '../../services/api';

export default function CreateLesson() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !price) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Title and price are required',
      });
      return;
    }

    try {
      setLoading(true);

      await createLesson({
        title,
        description,
        price_coins: Number(price),
        status: 'active',
      });

      Toast.show({
        type: 'success',
        text1: 'Created',
        text2: 'Lesson created successfully',
      });

      router.replace('/home');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
          Create Lesson
        </Text>

        <Card>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
            style={inputStyle}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            style={inputStyle}
          />

          <TextInput
            placeholder="Price (coins)"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            style={inputStyle}
          />

          <AppButton
            title={loading ? 'Creating...' : 'Create Lesson'}
            onPress={handleCreate}
            disabled={loading}
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
  marginBottom: 12,
};