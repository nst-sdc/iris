'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function TestLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      // Clear any existing tokens first
      localStorage.clear();
      
      // Generate a test JWT token by calling backend
      const response = await fetch('http://localhost:5657/auth/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: '691d87bbed4e1e9a98366811' }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Backend error: ${error}`);
      }

      const data = await response.json();
      console.log('Test login response:', data);
      
      if (data.token && data.user) {
        // Use the user data from backend response
        const userData = {
          _id: data.user.id,
          id: data.user.id,
          username: data.user.username,
          full_name: data.user.full_name,
          email: data.user.email,
          role: data.user.role,
          coins: data.user.coins,
        };
        
        login(userData, data.token);
        
        // Force reload to clear any cached state
        window.location.href = '/dashboard/admin';
      } else {
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error('Test login failed:', error);
      alert(`Test login failed: ${error}. Make sure backend is running on port 5657.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Test Login</h2>
          <p className="text-gray-400">Quick login for testing (bypasses GitHub OAuth)</p>
        </div>

        <button
          onClick={handleTestLogin}
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login as Admin (Vipul)'}
        </button>

        <p className="text-sm text-gray-500">
          This creates a valid JWT token for testing without GitHub OAuth
        </p>
      </div>
    </div>
  );
}
