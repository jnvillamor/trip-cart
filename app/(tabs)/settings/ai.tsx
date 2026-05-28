import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { useTheme } from '@/ui/theme/ThemeProvider';

const PROVIDERS = [
  {
    key: 'rule-based',
    label: 'Rule-based',
    icon: 'auto-awesome' as const,
    description: 'Local keyword matching for category suggestions and frequently-bought hints. No network calls, no data leaves your device.',
    active: true,
    disabled: false,
  },
  {
    key: 'on-device',
    label: 'On-device LLM',
    icon: 'phone-iphone' as const,
    description: 'Local LLM for smarter category and unit suggestions. Coming in a later release.',
    active: false,
    disabled: true,
  },
  {
    key: 'cloud',
    label: 'Cloud model',
    icon: 'cloud' as const,
    description: 'Optional cloud assistant for richer insights. Coming in a later release.',
    active: false,
    disabled: true,
  },
];

export default function AiSettingsScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="AI" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 12,
            paddingHorizontal: 4,
          }}
        >
          TripCart uses a single provider for category suggestions, frequently-bought hints, and insights. v1 is rule-based only.
        </Text>
        <View
          style={{
            backgroundColor: tokens.bg.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            overflow: 'hidden',
          }}
        >
          {PROVIDERS.map((p, i) => (
            <View
              key={p.key}
              style={{
                padding: 14,
                flexDirection: 'row',
                gap: 14,
                borderBottomWidth: i === PROVIDERS.length - 1 ? 0 : 1,
                borderBottomColor: tokens.border.subtle,
                opacity: p.disabled ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: p.active ? tokens.accent.base : tokens.bg.tonal,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons
                  name={p.icon}
                  color={p.active ? tokens.text.onAccent : tokens.accent.base}
                  size={20}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Text
                    style={{
                      color: tokens.text.primary,
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  >
                    {p.label}
                  </Text>
                  {p.active ? (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 999,
                        backgroundColor: tokens.success[0],
                      }}
                    >
                      <Text
                        style={{
                          color: tokens.text.onAccent,
                          fontSize: 10,
                          fontWeight: '800',
                          letterSpacing: 0.4,
                        }}
                      >
                        ACTIVE
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  style={{
                    color: tokens.text.tertiary,
                    fontSize: 12,
                    marginTop: 4,
                    lineHeight: 17,
                  }}
                >
                  {p.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
