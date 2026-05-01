'use client';

import { useSignIn } from '@/hooks/auth/use-signin';
import { SignInBackground } from './signin-background';
import { SignInCard } from './signin-card';

export function SignInPage() {
  const {
    email, setEmail,
    password, setPassword,
    loading,
    handleLogin,
    handleGoogleLogin,
  } = useSignIn();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <SignInBackground />
      <SignInCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
}