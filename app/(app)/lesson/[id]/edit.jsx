import { useEffect, useState } from 'react';
import { Text, TextInput, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '../../../../components/Screen';
import Card from '../../../../components/Card';
import AppButton from '../../../../components/AppButton';
import { fetchLessonById, updateLesson } from '../../../../services/api';

export default function EditLesson() {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLesson = async () => {
    try {
      const data = await fetchLessonById(id);

      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice(String(data.price_coins || ''));
      setStatus(data.status || 'active');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed to load lesson',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadLesson();
  }, [id]);

  const handleSave = async () => {
    if (!title || !price) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Title and price are required.',
      });
      return;
    }

    try {
      setSaving(true);

      await updateLesson(id, {
        title,
        description,
        price_coins: Number(price),
        status,
      });

      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Lesson updated successfully.',
      });

      router.replace('/my-lessons');
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
          Edit Lesson
        </Text>

        <Card>
          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Title</Text>
          <TextInput value={title} onChangeText={setTitle} style={inputStyle} />

          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={[inputStyle, { minHeight: 90, textAlignVertical: 'top' }]}
          />

          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={inputStyle}
          />

          <Text style={{ color: '#94a3b8', marginBottom: 6 }}>Status</Text>

          <AppButton
            title={status === 'active' ? 'Status: Active' : 'Status: Draft'}
            onPress={() => setStatus(status === 'active' ? 'draft' : 'active')}
            variant="secondary"
            style={{ marginBottom: 12 }}
          />

          <AppButton
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
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