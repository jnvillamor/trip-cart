import { Switch, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ArchivedToggle({
  value,
  onChange,
  label = 'Show archived',
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={{ color: tokens.text.secondary, fontSize: 14 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: tokens.border.default, true: tokens.accent.base }}
        thumbColor={tokens.bg.page}
      />
    </View>
  );
}
