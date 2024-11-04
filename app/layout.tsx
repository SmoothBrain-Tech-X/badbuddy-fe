import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/providers/AuthProvider';
import MainProvider from '@/providers/MainProvider';
import { theme } from '../theme';

import '@mantine/notifications/styles.css'; // Don't forget to import styles

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
            <ModalsProvider>
              <AuthProvider>
                <Notifications position="top-right" zIndex={2077} />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 3000,
                    loading: {
                      duration: Infinity,
                    },
                  }}
                />
                {children}
              </AuthProvider>
            </ModalsProvider>
          </MainProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
