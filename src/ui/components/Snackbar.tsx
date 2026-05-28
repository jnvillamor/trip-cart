import { MaterialIcons } from '@expo/vector-icons';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type SnackbarKind = 'success' | 'error' | 'info';

export type SnackbarOptions = {
  message: string;
  kind?: SnackbarKind;
  durationMs?: number;
  action?: { label: string; onPress: () => void };
};

type ActiveSnack = SnackbarOptions & { id: number };

type SnackbarApi = {
  show: (options: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarApi | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ActiveSnack[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setStack((s) => s.filter((x) => x.id !== id));
  }, []);

  const show = useCallback<SnackbarApi['show']>(
    (options) => {
      const id = nextId.current++;
      const duration = options.action ? options.durationMs ?? 5000 : options.durationMs ?? 3000;
      setStack((s) => [...s, { ...options, id }]);
      const handle = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, handle);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      for (const t of timers.current.values()) clearTimeout(t);
      timers.current.clear();
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      <SnackbarHost stack={stack} onDismiss={dismiss} />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarApi {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
  return ctx;
}

function SnackbarHost({
  stack,
  onDismiss,
}: {
  stack: ActiveSnack[];
  onDismiss: (id: number) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 24,
        gap: 8,
      }}
    >
      {stack.map((s) => (
        <Animated.View
          key={s.id}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutDown.duration(160)}
          layout={LinearTransition.duration(180)}
        >
          <SnackbarRow snack={s} onDismiss={() => onDismiss(s.id)} />
        </Animated.View>
      ))}
    </View>
  );
}

function SnackbarRow({
  snack,
  onDismiss,
}: {
  snack: ActiveSnack;
  onDismiss: () => void;
}) {
  const { tokens } = useTheme();
  const kind: SnackbarKind = snack.kind ?? 'info';
  const accentColor =
    kind === 'success'
      ? tokens.success[0]
      : kind === 'error'
        ? tokens.danger[0]
        : tokens.info[0];
  const icon =
    kind === 'success'
      ? 'check-circle'
      : kind === 'error'
        ? 'error'
        : 'info';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: tokens.bg.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        paddingHorizontal: 14,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <MaterialIcons name={icon} color={accentColor} size={20} />
      <Text
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 18,
        }}
      >
        {snack.message}
      </Text>
      {snack.action ? (
        <Pressable
          onPress={() => {
            snack.action!.onPress();
            onDismiss();
          }}
          hitSlop={6}
          style={({ pressed }) => ({
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
          })}
        >
          <Text
            style={{
              color: accentColor,
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 0.3,
            }}
          >
            {snack.action.label.toUpperCase()}
          </Text>
        </Pressable>
      ) : null}
      <Pressable onPress={onDismiss} hitSlop={8} accessibilityLabel="Dismiss">
        <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
      </Pressable>
    </View>
  );
}
