import { AuthRepository } from '../../repositories/AuthRepository';
import { User, Profile } from '../../entities/User';

export class AuthUseCases {
  constructor(private authRepository: AuthRepository) {}

  async signIn(email: string, password: string): Promise<User> {
    return this.authRepository.signIn(email, password);
  }

  async signUp(email: string, password: string, name: string, city: string): Promise<User> {
    return this.authRepository.signUp(email, password, name, city);
  }

  async signInWithGoogle(): Promise<void> {
    return this.authRepository.signInWithGoogle();
  }

  async signOut(): Promise<void> {
    return this.authRepository.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    return this.authRepository.resetPassword(email);
  }

  async getProfile(userId: string): Promise<Profile> {
    return this.authRepository.getProfile(userId);
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    return this.authRepository.updateProfile(userId, updates);
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    return this.authRepository.uploadAvatar(userId, file);
  }
}
