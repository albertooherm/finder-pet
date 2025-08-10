import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset-password';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToResetPassword={() => setMode('reset-password')}
          />
        );
      case 'signup':
        return <SignUpForm onSwitchToLogin={() => setMode('login')} />;
      case 'reset-password':
        return <ResetPasswordForm onSwitchToLogin={() => setMode('login')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🐾 Finder Pet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Encuentra y ayuda a mascotas perdidas
          </p>
        </div>
        {renderForm()}
      </div>
    </div>
  );
};
