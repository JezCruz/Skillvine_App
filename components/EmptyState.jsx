import { Text, View } from 'react-native';

export default function EmptyState({ title, subtitle }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ color: '#94a3b8', textAlign: 'center' }}>
        {subtitle}
      </Text>
    </View>
  );
}