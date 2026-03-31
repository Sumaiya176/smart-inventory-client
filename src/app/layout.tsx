// src/app/layout.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Provider store={store}>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {isAuthPage ? (
            children
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                  {children}
                </main>
              </div>
            </div>
          )}
        </Provider>
      </body>
    </html>
  );
}