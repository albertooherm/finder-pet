import { create } from 'zustand';
import { AuthState, User, Profile } from '../../domain/entities/User';
import { AuthUseCases } from '../../domain/usecases/auth/AuthUseCases';
import { SupabaseAuthRepository } from '../repositories/SupabaseAuthRepository';

interface AuthStore extends AuthState {
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, city: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Create repository and use cases
const authRepository = new SupabaseAuthRepository();
const authUseCases = new AuthUseCases(authRepository);

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,

  // Actions
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      const session = await authUseCases.getSession();
      set({ session });

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
        };
        set({ user });

        // Fetch profile
        try {
          const profile = await authUseCases.getProfile(user.id);
          set({ profile });
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error initializing auth' });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await authUseCases.signIn(email, password);
      set({ user });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing in' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, name: string, city: string) => {
    try {
      set({ loading: true, error: null });
      const user = await authUseCases.signUp(email, password, name, city);
      set({ user });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing up' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      await authUseCases.signInWithGoogle();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing in with Google' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await authUseCases.signOut();
      set({ user: null, profile: null, session: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing out' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null });
      await authUseCases.resetPassword(email);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error resetting password' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      set({ loading: true, error: null });
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const updatedProfile = await authUseCases.updateProfile(user.id, updates);
      set({ profile: updatedProfile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating profile' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      set({ loading: true, error: null });
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const avatarUrl = await authUseCases.uploadAvatar(user.id, file);
      const { profile } = get();
      if (profile) {
        set({ profile: { ...profile, avatar_url: avatarUrl } });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error uploading avatar' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Set up auth state change listener
authRepository.onAuthStateChange(async (event) => {
  const { initialize } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    await initialize();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: null,
    });
  }
});
