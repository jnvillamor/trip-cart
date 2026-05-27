import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function NewCategoryScreen() {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg.page,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: tokens.text.primary }}>New category form</Text>
      <Text style={{ color: tokens.text.tertiary, marginTop: 4 }}>Phase 2A.4</Text>
    </View>
  );
}
