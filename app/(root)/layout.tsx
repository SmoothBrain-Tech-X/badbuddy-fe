import MainProvider from '@/providers/MainProvider';

export default function RootLayout({ children }: { children: any }) {
  return <MainProvider>{children}</MainProvider>;
}
