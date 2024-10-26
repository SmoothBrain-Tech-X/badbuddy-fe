import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import MainProvider from '@/providers/MainProvider';

export const metadata = {
  title: 'Badbuddy',
  description: 'Connect with badminton players and book courts',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <MainProvider>
            {children}
          </MainProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
