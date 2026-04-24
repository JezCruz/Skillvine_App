import { View } from 'react-native';

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: '#111827',
          padding: 16,
          borderRadius: 14,
          marginBottom: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}