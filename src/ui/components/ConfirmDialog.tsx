import { Modal, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type ConfirmRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmDialog({
  request,
  onClose,
}: {
  request: ConfirmRequest | null;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Modal
      visible={request !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: tokens.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: tokens.bg.surface,
            borderRadius: 18,
            padding: 22,
            gap: 16,
            width: '100%',
            maxWidth: 380,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ color: tokens.text.primary, fontSize: 18, fontWeight: '700' }}>
              {request?.title}
            </Text>
            <Text style={{ color: tokens.text.secondary, fontSize: 14, lineHeight: 20 }}>
              {request?.message}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: tokens.border.default,
                backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
              })}
            >
              <Text style={{ color: tokens.text.primary, fontWeight: '600', fontSize: 14 }}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                if (!request) return;
                await request.onConfirm();
                onClose();
              }}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: request?.destructive
                  ? pressed
                    ? tokens.danger[10]
                    : tokens.danger[0]
                  : pressed
                    ? tokens.accent.active
                    : tokens.accent.base,
              })}
            >
              <Text
                style={{
                  color: tokens.text.onAccent,
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                {request?.confirmLabel ?? 'Confirm'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
