import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurrencyMeta, SUPPORTED_CURRENCIES } from '@/domain/currency';
import { CurrencyRow } from '@/ui/components/settings-currency/CurrencyRow';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useTheme } from '@/ui/theme/ThemeProvider';

const GLOBAL_OPTION: CurrencyMeta = {
  code: '',
  name: 'Global default',
  symbol: 'GBL',
  decimals: 2,
};

export function CurrencyPickerSheet({
  visible,
  value,
  globalLabel = 'Use global default',
  onPick,
  onClose,
}: {
  visible: boolean;
  value: string;
  globalLabel?: string;
  onPick: (code: string) => void;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 120);

  const filtered = useMemo<CurrencyMeta[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const items: CurrencyMeta[] = q
      ? SUPPORTED_CURRENCIES.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q),
        )
      : [...SUPPORTED_CURRENCIES];
    if (q && !globalLabel.toLowerCase().includes(q)) return items;
    return [{ ...GLOBAL_OPTION, name: globalLabel }, ...items];
  }, [debouncedQuery, globalLabel]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => setQuery('')}
    >
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: tokens.overlay }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '80%',
          backgroundColor: tokens.bg.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border.default,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 18,
              fontWeight: '700',
              letterSpacing: -0.2,
              marginBottom: 10,
            }}
          >
            Pick a currency
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
              value={query}
              onChangeText={setQuery}
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
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={6}>
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
            borderRadius: 14,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            backgroundColor: tokens.bg.page,
            overflow: 'hidden',
          }}
        >
          <FlashList
            data={filtered}
            keyExtractor={(c) => c.code || 'global'}
            renderItem={({ item, index }) => (
              <CurrencyRow
                currency={item}
                active={item.code === value}
                isLast={index === filtered.length - 1}
                onPress={() => {
                  onPick(item.code);
                  onClose();
                }}
              />
            )}
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
                  No currency matches &ldquo;{debouncedQuery}&rdquo;
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
