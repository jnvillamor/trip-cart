import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search goods',
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: tokens.bg.tonal,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <MaterialIcons name="search" color={tokens.text.tertiary} size={18} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={tokens.text.tertiary}
        autoFocus
        autoCorrect={false}
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 15,
          paddingVertical: 0,
        }}
      />
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={6}>
          <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}
