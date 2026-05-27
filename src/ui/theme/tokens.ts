export type Theme = {
  primary: { 0: string; 10: string; 20: string; 30: string; 40: string; 50: string };
  surface: { 0: string; 10: string; 20: string; 30: string; 40: string; 50: string };
  surfaceTonal: { 0: string; 10: string; 20: string; 30: string; 40: string; 50: string };
  success: { 0: string; 10: string; 20: string };
  warning: { 0: string; 10: string; 20: string };
  danger: { 0: string; 10: string; 20: string };
  info: { 0: string; 10: string; 20: string };
  bg: { page: string; surface: string; elevated: string; tonal: string };
  text: { primary: string; secondary: string; tertiary: string; onAccent: string };
  border: { subtle: string; default: string; strong: string };
  accent: { base: string; hover: string; active: string };
  overlay: string;
  focusRing: string;
};

export const darkTheme: Theme = {
  primary: {
    0: '#7dd4e1',
    10: '#8cd8e4',
    20: '#9adde7',
    30: '#a7e1ea',
    40: '#b4e6ed',
    50: '#c1eaf0',
  },
  surface: {
    0: '#121212',
    10: '#252525',
    20: '#393939',
    30: '#4f4f4f',
    40: '#666666',
    50: '#7d7d7d',
  },
  surfaceTonal: {
    0: '#1c2223',
    10: '#2f3435',
    20: '#434849',
    30: '#585c5d',
    40: '#6d7272',
    50: '#848888',
  },
  success: { 0: '#7dff95', 10: '#9dffac', 20: '#b8ffc1' },
  warning: { 0: '#ffbc5e', 10: '#ffca83', 20: '#ffd8a4' },
  danger: { 0: '#ff8080', 10: '#ff9b99', 20: '#ffb5b2' },
  info: { 0: '#87d1ff', 10: '#a1dbff', 20: '#b9e4ff' },
  bg: {
    page: '#121212',
    surface: '#252525',
    elevated: '#393939',
    tonal: '#1c2223',
  },
  text: {
    primary: '#f5f5f5',
    secondary: '#c4c4c4',
    tertiary: '#888888',
    onAccent: '#04343a',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.30)',
  },
  accent: {
    base: '#7dd4e1',
    hover: '#8cd8e4',
    active: '#9adde7',
  },
  overlay: 'rgba(0, 0, 0, 0.6)',
  focusRing: '#7dd4e1',
};

export const lightTheme: Theme = {
  primary: {
    0: '#0d6470',
    10: '#18808e',
    20: '#2a9aa8',
    30: '#4cb5c2',
    40: '#7dd4e1',
    50: '#b4e6ed',
  },
  surface: {
    0: '#ffffff',
    10: '#f5f5f5',
    20: '#ebebeb',
    30: '#dcdcdc',
    40: '#c4c4c4',
    50: '#a8a8a8',
  },
  surfaceTonal: {
    0: '#f3f7f8',
    10: '#e8f0f1',
    20: '#d8e3e5',
    30: '#c2d1d3',
    40: '#a6b6b8',
    50: '#889a9c',
  },
  success: { 0: '#128a2c', 10: '#2faa49', 20: '#5cc673' },
  warning: { 0: '#b56b00', 10: '#d48526', 20: '#eba24f' },
  danger: { 0: '#c41e1e', 10: '#de4242', 20: '#ef6b6b' },
  info: { 0: '#1565c0', 10: '#3a83d9', 20: '#6ba6e8' },
  bg: {
    page: '#ffffff',
    surface: '#f5f5f5',
    elevated: '#ebebeb',
    tonal: '#f3f7f8',
  },
  text: {
    primary: '#1c2223',
    secondary: '#4f4f4f',
    tertiary: '#7d7d7d',
    onAccent: '#ffffff',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.06)',
    default: 'rgba(0, 0, 0, 0.12)',
    strong: 'rgba(0, 0, 0, 0.24)',
  },
  accent: {
    base: '#0d6470',
    hover: '#18808e',
    active: '#2a9aa8',
  },
  overlay: 'rgba(28, 34, 35, 0.45)',
  focusRing: '#0d6470',
};
