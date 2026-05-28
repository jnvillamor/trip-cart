import { Pressable, Text } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ArchiveFooterButton({
  isArchived,
  entityLabel,
  busy,
  onPress,
}: {
  isArchived: boolean;
  entityLabel: string;
  busy: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  const label = isArchived ? `Unarchive ${entityLabel}` : `Archive ${entityLabel}`;
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => ({
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.border.default,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        marginTop: 8,
      })}
    >
      <Text
        style={{
          color: isArchived ? tokens.text.primary : tokens.danger[0],
          fontWeight: '600',
          fontSize: 15,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
