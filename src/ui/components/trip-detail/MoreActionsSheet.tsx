import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type MoreAction = {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export function MoreActionsSheet({
  visible,
  actions,
  onClose,
}: {
  visible: boolean;
  actions: MoreAction[];
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: tokens.overlay }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: tokens.bg.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 36,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border.default,
            marginBottom: 12,
          }}
        />
        {actions.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => {
              if (a.disabled) return;
              onClose();
              a.onPress();
            }}
            disabled={a.disabled}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
              opacity: a.disabled ? 0.4 : 1,
            })}
          >
            <MaterialIcons
              name={a.icon}
              color={a.destructive ? tokens.danger[0] : tokens.text.primary}
              size={20}
            />
            <Text
              style={{
                color: a.destructive ? tokens.danger[0] : tokens.text.primary,
                fontSize: 15,
                fontWeight: '500',
              }}
            >
              {a.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}
