'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';

type Props = {
  children: React.ReactNode;
};

const MainProvider = (props: Props) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ marginBottom: '85px' }}>
        <Navbar />
      </div>
      {props.children}
    </QueryClientProvider>
  );
};

export default MainProvider;
