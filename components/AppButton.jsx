import { Pressable, Text } from 'react-native';

export default function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const backgroundColor =
    variant === 'danger'
      ? '#ef4444'
      : variant === 'success'
      ? '#22c55e'
      : variant === 'secondary'
      ? '#1e293b'
      : '#06b6d4';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? '#64748b' : backgroundColor,
          padding: 12,
          borderRadius: 10,
          alignItems: 'center',
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: variant === 'primary' || variant === 'success' ? '#000' : '#fff',
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}