import { Platform, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export function FAB({
  onPress,
  accessibilityLabel,
  icon = '+',
}: {
  onPress: () => void;
  accessibilityLabel: string;
  icon?: string;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        position: 'absolute',
        right: 20,
        bottom: insets.bottom + TAB_BAR_HEIGHT + 16,
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: tokens.accent.base,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      })}
    >
      <Text
        style={{
          color: tokens.text.onAccent,
          fontSize: 30,
          fontWeight: '400',
          lineHeight: 32,
          marginTop: -2,
        }}
      >
        {icon}
      </Text>
    </Pressable>
  );
}

/**
 * Reserve at the bottom of a list so the FAB doesn't cover the last item.
 * Pass to `contentContainerStyle.paddingBottom`.
 */
export function useFabBottomReserve() {
  const insets = useSafeAreaInsets();
  return insets.bottom + TAB_BAR_HEIGHT + 96;
}
