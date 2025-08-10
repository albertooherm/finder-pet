import { AuthUseCases } from '@/domain/usecases/auth/AuthUseCases';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { User, Profile } from '@/domain/entities/User';

// Mock repository
const mockRepository: jest.Mocked<AuthRepository> = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  getSession: jest.fn(),
  onAuthStateChange: jest.fn(),
};

describe('AuthUseCases', () => {
  let authUseCases: AuthUseCases;

  beforeEach(() => {
    authUseCases = new AuthUseCases(mockRepository);
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call repository signIn method', async () => {
      const mockUser: User = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockRepository.signIn.mockResolvedValue(mockUser);

      const result = await authUseCases.signIn('test@example.com', 'password123');

      expect(mockRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Invalid credentials');
      mockRepository.signIn.mockRejectedValue(error);

      await expect(authUseCases.signIn('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should call repository signUp method', async () => {
      const mockUser: User = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockRepository.signUp.mockResolvedValue(mockUser);

      const result = await authUseCases.signUp('test@example.com', 'password123', 'Test User', 'Test City');

      expect(mockRepository.signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User', 'Test City');
      expect(result).toEqual(mockUser);
    });
  });

  describe('signInWithGoogle', () => {
    it('should call repository signInWithGoogle method', async () => {
      mockRepository.signInWithGoogle.mockResolvedValue();

      await authUseCases.signInWithGoogle();

      expect(mockRepository.signInWithGoogle).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should call repository signOut method', async () => {
      mockRepository.signOut.mockResolvedValue();

      await authUseCases.signOut();

      expect(mockRepository.signOut).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should call repository resetPassword method', async () => {
      mockRepository.resetPassword.mockResolvedValue();

      await authUseCases.resetPassword('test@example.com');

      expect(mockRepository.resetPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('getProfile', () => {
    it('should call repository getProfile method', async () => {
      const mockProfile: Profile = {
        id: 'test-id',
        name: 'Test User',
        city: 'Test City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockRepository.getProfile.mockResolvedValue(mockProfile);

      const result = await authUseCases.getProfile('test-id');

      expect(mockRepository.getProfile).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should call repository updateProfile method', async () => {
      const updates = { name: 'Updated Name', city: 'Updated City' };
      const mockProfile: Profile = {
        id: 'test-id',
        name: 'Updated Name',
        city: 'Updated City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockRepository.updateProfile.mockResolvedValue(mockProfile);

      const result = await authUseCases.updateProfile('test-id', updates);

      expect(mockRepository.updateProfile).toHaveBeenCalledWith('test-id', updates);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('uploadAvatar', () => {
    it('should call repository uploadAvatar method', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockAvatarUrl = 'https://example.com/avatar.jpg';

      mockRepository.uploadAvatar.mockResolvedValue(mockAvatarUrl);

      const result = await authUseCases.uploadAvatar('test-id', mockFile);

      expect(mockRepository.uploadAvatar).toHaveBeenCalledWith('test-id', mockFile);
      expect(result).toBe(mockAvatarUrl);
    });
  });
});
