import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const KEY = 'tripcart.onboarded';

export function useOnboarded() {
  return useQuery({
    queryKey: ['onboarded'],
    queryFn: async () => {
      const v = await AsyncStorage.getItem(KEY);
      return v === 'true';
    },
  });
}

export function useSetOnboarded() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: boolean) => {
      await AsyncStorage.setItem(KEY, value ? 'true' : 'false');
      return value;
    },
    onSuccess: (value) => qc.setQueryData(['onboarded'], value),
  });
}
