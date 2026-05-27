import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { TripStatus } from '@/domain/schemas';
import { Theme } from '@/ui/theme/tokens';

export function tripStatusVisuals(status: TripStatus, tokens: Theme) {
  switch (status) {
    case TRIP_STATUS_ENUM.PLANNED:
      return { color: tokens.info[0], label: 'Planned' };
    case TRIP_STATUS_ENUM.IN_PROGRESS:
      return { color: tokens.accent.base, label: 'Shopping' };
    case TRIP_STATUS_ENUM.COMPLETED:
      return { color: tokens.success[0], label: 'Done' };
    case TRIP_STATUS_ENUM.CANCELED:
      return { color: tokens.text.tertiary, label: 'Canceled' };
  }
}
