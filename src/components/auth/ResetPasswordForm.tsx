import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar el email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-green-600">
            Email Enviado
          </CardTitle>
          <CardDescription className="text-center">
            Hemos enviado un enlace de recuperación a tu email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onSwitchToLogin}
          >
            Volver al inicio de sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Recuperar Contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu email para recibir un enlace de recuperación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Email de Recuperación'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 hover:underline"
            disabled={isLoading}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
