import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function GoodsListScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <SegmentedHeader active="goods" tokens={tokens} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.primary }}>Goods list</Text>
        <Text style={{ color: tokens.text.tertiary, marginTop: 8 }}>Phase 2A.5</Text>
      </View>
    </View>
  );
}

function SegmentedHeader({ active, tokens }: { active: 'goods' | 'categories'; tokens: Theme }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
      <Segment
        label="Goods"
        active={active === 'goods'}
        tokens={tokens}
        onPress={() => router.replace('/catalog/goods')}
      />
      <Segment
        label="Categories"
        active={active === 'categories'}
        tokens={tokens}
        onPress={() => router.replace('/catalog/categories')}
      />
      <View style={{ flex: 1 }} />
      <Pressable
        onPress={() => router.push('/catalog/stores')}
        accessibilityLabel="More catalog options"
        style={{ padding: 8 }}
      >
        <MaterialIcons name="more-vert" color={tokens.text.primary} size={24} />
      </Pressable>
    </View>
  );
}

function Segment({
  label,
  active,
  onPress,
  tokens,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tokens: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: active ? tokens.accent.base : tokens.bg.elevated,
      }}
    >
      <Text
        style={{
          color: active ? tokens.text.onAccent : tokens.text.secondary,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
