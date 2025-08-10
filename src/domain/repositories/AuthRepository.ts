import { User, Profile } from '../entities/User';

export interface AuthRepository {
  // Auth methods
  signIn(email: string, password: string): Promise<User>;
  signUp(email: string, password: string, name: string, city: string): Promise<User>;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  
  // Profile methods
  getProfile(userId: string): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;
  uploadAvatar(userId: string, file: File): Promise<string>;
  
  // Session methods
  getSession(): Promise<unknown>;
  onAuthStateChange(callback: (event: string, session: unknown) => void): () => void;
}
