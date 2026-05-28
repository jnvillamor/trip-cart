import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { ChartMode } from '@/ui/hooks/insights-by-category/useInsightsByCategoryController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ChartModeToggle({
  value,
  onChange,
}: {
  value: ChartMode;
  onChange: (next: ChartMode) => void;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: tokens.bg.tonal,
        borderRadius: 999,
        padding: 4,
        gap: 4,
        alignSelf: 'flex-start',
      }}
    >
      <ModeButton
        active={value === 'pie'}
        icon="donut-large"
        onPress={() => onChange('pie')}
      />
      <ModeButton
        active={value === 'bar'}
        icon="bar-chart"
        onPress={() => onChange('bar')}
      />
    </View>
  );
}

function ModeButton({
  active,
  icon,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={icon}
      style={({ pressed }) => ({
        width: 36,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active
          ? tokens.accent.base
          : pressed
            ? tokens.bg.elevated
            : 'transparent',
      })}
    >
      <MaterialIcons
        name={icon}
        size={18}
        color={active ? tokens.text.onAccent : tokens.text.secondary}
      />
    </Pressable>
  );
}
