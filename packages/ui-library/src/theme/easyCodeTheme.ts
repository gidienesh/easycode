import { MantineThemeOverride } from '@mantine/core';

export const easyCodeTheme: MantineThemeOverride = {
  colorScheme: 'light',
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },
  components: {
    Button: {
      styles: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    Card: {
      styles: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  globalStyles: (theme) => ({
    body: {
      backgroundColor: theme.colors.gray[0],
    },
  }),
};
