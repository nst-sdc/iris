'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        console.error('No authorization code found');
        router.push('/login?error=no_code');
        return;
      }

      try {
        // Call backend callback endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/github/callback?code=${code}&state=${state}`
        );

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (data.success && data.token) {
          // Update auth context (which also stores to localStorage)
          login(data.user, data.token);

          // Redirect based on role
          if (data.user.role === 'Admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard/member');
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-cyan-400 text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
