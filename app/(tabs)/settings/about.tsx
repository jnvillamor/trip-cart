import { MaterialIcons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { APP_VERSION, SCHEMA_VERSION } from '@/domain/version';
import { PageHeader } from '@/ui/components/PageHeader';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function AboutScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="About" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 16, gap: 8 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              backgroundColor: tokens.accent.base,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="shopping-cart" color={tokens.text.onAccent} size={36} />
          </View>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 24,
              fontWeight: '700',
              letterSpacing: -0.3,
              marginTop: 4,
            }}
          >
            TripCart
          </Text>
          <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
            Plan trips. Track spend. Keep history local.
          </Text>
        </View>

        <Section title="Versions" tokens={tokens}>
          <InfoRow label="App version" value={APP_VERSION} tokens={tokens} />
          <InfoRow
            label="Data schema"
            value={`v${SCHEMA_VERSION}`}
            tokens={tokens}
            isLast
          />
        </Section>

        <Section title="Developer" tokens={tokens}>
          <DeveloperRow
            name="John Noel Villamor"
            handle="jnvillamor"
            tokens={tokens}
          />
        </Section>

        <Section title="Links" tokens={tokens}>
          <LinkRow
            icon="bug-report"
            label="Report an issue"
            href="https://github.com/jnvillamor/trip-cart/issues"
            tokens={tokens}
            isLast
          />
        </Section>

        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 11,
            textAlign: 'center',
            paddingVertical: 8,
          }}
        >
          Built with Expo, TanStack Query, victory-native, and Drizzle. All data stays on
          your device.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  tokens,
  children,
}: {
  title: string;
  tokens: Theme;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          paddingHorizontal: 4,
        }}
      >
        {title}
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
        {children}
      </View>
    </View>
  );
}

function InfoRow({
  label,
  value,
  tokens,
  isLast,
}: {
  label: string;
  value: string;
  tokens: Theme;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      }}
    >
      <Text style={{ color: tokens.text.primary, fontSize: 14, fontWeight: '500' }}>
        {label}
      </Text>
      <Text style={{ color: tokens.text.tertiary, fontSize: 14, fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

function DeveloperRow({
  name,
  handle,
  tokens,
}: {
  name: string;
  handle: string;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="person" color={tokens.accent.base} size={18} />
      </View>
      <Text
        style={{ flex: 1, color: tokens.text.primary, fontSize: 14, fontWeight: '500' }}
      >
        {name}{' '}
        <Text
          onPress={() =>
            Linking.openURL(`https://github.com/${handle}`).catch(() => undefined)
          }
          style={{ color: tokens.accent.base, fontWeight: '600' }}
        >
          (@{handle})
        </Text>
      </Text>
    </View>
  );
}

function LinkRow({
  icon,
  label,
  href,
  tokens,
  isLast,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  href: string;
  tokens: Theme;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={() => Linking.openURL(href).catch(() => undefined)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={icon} color={tokens.accent.base} size={18} />
      </View>
      <Text
        style={{ flex: 1, color: tokens.text.primary, fontSize: 14, fontWeight: '500' }}
      >
        {label}
      </Text>
      <MaterialIcons name="open-in-new" color={tokens.text.tertiary} size={16} />
    </Pressable>
  );
}
