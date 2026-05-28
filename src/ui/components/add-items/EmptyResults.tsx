import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function EmptyResults({ query }: { query: string }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <MaterialIcons name="search-off" color={tokens.text.tertiary} size={32} />
      </View>
      <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '700' }}>
        {query ? `No goods match "${query}"` : 'No goods yet'}
      </Text>
      <Text
        style={{
          color: tokens.text.tertiary,
          marginTop: 6,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        {query
          ? 'Try a different search or add this good to your catalog.'
          : 'Add goods in the Catalog tab to plan trips with them.'}
      </Text>
    </View>
  );
}
