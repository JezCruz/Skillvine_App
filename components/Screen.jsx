import { View } from 'react-native';

export default function Screen({ children, style }) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#020617',
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}