import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Pressable, Text, TextInput, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { CurrencyRow } from '@/ui/components/settings-currency/CurrencyRow';
import { useCurrencySettingsController } from '@/ui/hooks/settings-currency/useCurrencySettingsController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CurrencySettingsScreen() {
  const { tokens } = useTheme();
  const ctrl = useCurrencySettingsController();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Currency" />

      <View style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 4, gap: 8 }}>
        <Text
          style={{ color: tokens.text.tertiary, fontSize: 12, paddingHorizontal: 4 }}
        >
          Changing the global currency only affects future trips.
        </Text>
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
            value={ctrl.query}
            onChangeText={ctrl.setQuery}
            placeholder="Search currency"
            placeholderTextColor={tokens.text.tertiary}
            autoCorrect={false}
            style={{
              flex: 1,
              color: tokens.text.primary,
              fontSize: 15,
              paddingVertical: 0,
            }}
          />
          {ctrl.query ? (
            <Pressable onPress={() => ctrl.setQuery('')} hitSlop={6}>
              <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View
        style={{
          flex: 1,
          marginHorizontal: 16,
          marginTop: 4,
          marginBottom: 16,
          backgroundColor: tokens.bg.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          overflow: 'hidden',
        }}
      >
        <FlashList
          data={ctrl.list}
          keyExtractor={(c) => c.code}
          renderItem={({ item, index }) => (
            <CurrencyRow
              currency={item}
              active={item.code === ctrl.current}
              isLast={index === ctrl.list.length - 1}
              onPress={() => ctrl.select(item.code)}
            />
          )}
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
                No currency matches &ldquo;{ctrl.debouncedQuery}&rdquo;
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
