import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { Profile } from '../../domain/entities/User';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: (userId: string) => [...authKeys.all, 'profile', userId] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Profile query hook
export const useProfile = (userId: string | null) => {
  const { getProfile } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(userId!),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Profile update mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (updates: Partial<Profile>) => updateProfile(updates),
    onSuccess: (updatedProfile) => {
      // Update the profile in the store
      useAuthStore.setState({ profile: updatedProfile });
      
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(updatedProfile.id),
      });
    },
  });
};

// Avatar upload mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { uploadAvatar } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Update the profile in the store
      const { profile } = useAuthStore.getState();
      if (profile) {
        const updatedProfile = { ...profile, avatar_url: avatarUrl };
        useAuthStore.setState({ profile: updatedProfile });
        
        // Invalidate and refetch profile queries
        queryClient.invalidateQueries({
          queryKey: authKeys.profile(profile.id),
        });
      }
    },
  });
};

// Auth actions hooks
export const useSignIn = () => {
  const { signIn } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
};

export const useSignUp = () => {
  const { signUp } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ 
      email, 
      password, 
      name, 
      city 
    }: { 
      email: string; 
      password: string; 
      name: string; 
      city: string 
    }) => signUp(email, password, name, city),
  });
};

export const useSignInWithGoogle = () => {
  const { signInWithGoogle } = useAuthStore();
  
  return useMutation({
    mutationFn: () => signInWithGoogle(),
  });
};

export const useSignOut = () => {
  const { signOut } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      // Clear all queries on sign out
      queryClient.clear();
    },
  });
};

export const useResetPassword = () => {
  const { resetPassword } = useAuthStore();
  
  return useMutation({
    mutationFn: (email: string) => resetPassword(email),
  });
};
