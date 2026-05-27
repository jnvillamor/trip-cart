import { MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ListCard({
  onPress,
  leading,
  title,
  subtitle,
  archived,
  trailing,
}: {
  onPress: () => void;
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  archived?: boolean;
  trailing?: ReactNode;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        marginVertical: 6,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {leading}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {archived ? (
            <MaterialIcons name="archive" color={tokens.text.tertiary} size={14} />
          ) : null}
        </View>
        {subtitle ? (
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 13, marginTop: 2 }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}
