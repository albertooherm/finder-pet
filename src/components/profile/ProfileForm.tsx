import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  role: z.enum(['adoptante', 'publicador', 'admin']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { profile, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      city: profile?.city || '',
      role: profile?.role || 'adoptante',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
        <CardDescription>
          Actualiza tu información personal y preferencias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={profile?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isLoading}
              />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </label>
          </div>
          <div>
            <h3 className="font-semibold">Foto de Perfil</h3>
            <p className="text-sm text-gray-600">Haz clic en el ícono para cambiar tu foto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                {...register('name')}
                type="text"
                placeholder="Tu nombre completo"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad</label>
              <Input
                {...register('city')}
                type="text"
                placeholder="Tu ciudad"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rol</label>
            <select
              {...register('role')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="adoptante">Adoptante</option>
              <option value="publicador">Publicador</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-500 text-center">Perfil actualizado exitosamente</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
          </Button>
        </form>

        {/* Profile Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Información de la Cuenta</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Email:</strong> {profile?.id}</p>
            <p><strong>Verificado:</strong> {profile?.verified ? 'Sí' : 'No'}</p>
            <p><strong>Miembro desde:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
