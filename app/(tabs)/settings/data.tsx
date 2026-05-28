import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ConfirmDialog } from '@/ui/components/ConfirmDialog';
import { PageHeader } from '@/ui/components/PageHeader';
import { useDataSettingsController } from '@/ui/hooks/settings-data/useDataSettingsController';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function DataSettingsScreen() {
  const { tokens } = useTheme();
  const ctrl = useDataSettingsController();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Data" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Section title="Backup" tokens={tokens}>
          <ActionRow
            icon="upload"
            label="Export JSON"
            description="Save a backup of every trip, store, good, and category as a single JSON file."
            busy={ctrl.busy === 'exporting'}
            onPress={ctrl.exportData}
            tokens={tokens}
          />
          <ActionRow
            icon="download"
            label="Import JSON"
            description="Replace all current data with a previously exported backup."
            busy={ctrl.busy === 'importing'}
            destructive
            onPress={ctrl.pickImport}
            tokens={tokens}
            isLast
          />
        </Section>

        {ctrl.errorMsg ? (
          <View
            style={{
              backgroundColor: tokens.bg.tonal,
              borderRadius: 12,
              padding: 12,
              borderLeftWidth: 3,
              borderLeftColor: tokens.danger[0],
            }}
          >
            <Text style={{ color: tokens.danger[0], fontSize: 13, fontWeight: '700' }}>
              {ctrl.errorMsg}
            </Text>
          </View>
        ) : null}

        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 12,
            lineHeight: 18,
            paddingHorizontal: 4,
          }}
        >
          Backups live entirely on your device. Import currently uses replace mode —
          merge support will land in a later release.
        </Text>
      </ScrollView>

      <ConfirmDialog request={ctrl.confirm} onClose={() => ctrl.setConfirm(null)} />
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

function ActionRow({
  icon,
  label,
  description,
  busy,
  destructive,
  onPress,
  tokens,
  isLast,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  busy: boolean;
  destructive?: boolean;
  onPress: () => void;
  tokens: Theme;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        padding: 14,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
        opacity: busy ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: destructive ? tokens.danger[0] : tokens.accent.base,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={icon} color={tokens.text.onAccent} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '700' }}>
          {busy ? `${label}…` : label}
        </Text>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 12,
            marginTop: 2,
            lineHeight: 17,
          }}
        >
          {description}
        </Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        color={tokens.text.tertiary}
        size={20}
        style={{ marginTop: 8 }}
      />
    </Pressable>
  );
}
