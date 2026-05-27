import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { BackChip } from './BackChip';

export function PageHeader({
  title,
  subtitle,
  back = true,
  trailing,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  trailing?: ReactNode;
}) {
  const { tokens } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: tokens.bg.page }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 12,
        }}
      >
        {back ? <BackChip /> : null}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 22,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                color: tokens.text.tertiary,
                fontSize: 13,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing}
      </View>
    </SafeAreaView>
  );
}
