import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type Segment = 'goods' | 'categories';

export function SegmentedPill({
  active,
  onChange,
}: {
  active: Segment;
  onChange: (next: Segment) => void;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: tokens.bg.tonal,
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}
    >
      <SegmentButton
        label="Goods"
        active={active === 'goods'}
        onPress={() => onChange('goods')}
      />
      <SegmentButton
        label="Categories"
        active={active === 'categories'}
        onPress={() => onChange('categories')}
      />
    </View>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        backgroundColor: active
          ? tokens.accent.base
          : pressed
            ? tokens.bg.elevated
            : 'transparent',
      })}
    >
      <Text
        style={{
          color: active ? tokens.text.onAccent : tokens.text.secondary,
          fontWeight: '600',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
