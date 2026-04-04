import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#e2e8f0',
            border: '1px solid #2a2a2a',
            fontSize: '12px',
          },
        }}
      />
    </>
  );
}
