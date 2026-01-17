'use client';

import ProtectedRoute from '@/components/features/auth/protected-routes';
import MainLayout from '@/components/features/layout/main-layout';

export default function Home() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}