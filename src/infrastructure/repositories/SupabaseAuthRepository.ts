import { createClient } from '@supabase/supabase-js';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { User, Profile } from '../../domain/entities/User';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('No user returned');
    
    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };
  }

  async signUp(email: string, password: string, name: string, city: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          city,
        },
      },
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('No user returned');
    
    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
  }

  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');

    return data as Profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');

    return data as Profile;
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async getSession(): Promise<unknown> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  }
}
