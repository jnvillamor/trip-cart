import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

/**
 * Bottom-sheet for editing a single decimal value (e.g. unit price).
 * Uses the native decimal keyboard — no custom numpad.
 */
export function NumpadSheet({
  visible,
  initial,
  currency,
  onSave,
  onClose,
}: {
  visible: boolean;
  initial: number;
  currency: string;
  onSave: (value: number) => void;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setText(initial > 0 ? String(initial) : '');
    }
  }, [visible, initial]);

  function handleChange(next: string) {
    // Permit digits + a single '.' only.
    const sanitized = next.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const limited = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setText(limited);
  }

  function done() {
    const num = parseFloat(text);
    Keyboard.dismiss();
    onSave(Number.isFinite(num) ? num : 0);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onShow={() => inputRef.current?.focus()}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: tokens.overlay }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <View
          style={{
            backgroundColor: tokens.bg.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            paddingBottom: 28,
            gap: 16,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: tokens.border.default,
              marginTop: -8,
            }}
          />
          <Text
            style={{
              color: tokens.text.tertiary,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Unit price · {currency}
          </Text>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={handleChange}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={tokens.text.tertiary}
            selectTextOnFocus
            returnKeyType="done"
            onSubmitEditing={done}
            style={{
              fontSize: 36,
              fontWeight: '700',
              color: tokens.text.primary,
              letterSpacing: -0.5,
              backgroundColor: tokens.bg.tonal,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              textAlign: 'center',
            }}
          />
          <Pressable
            onPress={done}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
            })}
          >
            <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
              Done
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
