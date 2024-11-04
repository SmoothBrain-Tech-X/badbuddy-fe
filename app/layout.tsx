import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { Anuphan } from 'next/font/google';
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

const fontSans = Anuphan({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
      <body className={fontSans.className}>
        <MantineProvider theme={theme}>
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
        </MantineProvider>
      </body>
    </html>
  );
}
