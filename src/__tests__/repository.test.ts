import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { Profile } from '@/domain/entities/User';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  })),
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-key',
  };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

describe('SupabaseAuthRepository', () => {
  let repository: SupabaseAuthRepository;
  let mockSupabase: unknown;

  beforeEach(() => {
    const { createClient } = jest.requireMock('@supabase/supabase-js');
    mockSupabase = createClient();
    repository = new SupabaseAuthRepository();
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await repository.signIn('test@example.com', 'password123');

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      });
    });

    it('should throw error on sign in failure', async () => {
      const error = new Error('Invalid credentials');
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error,
      });

      await expect(repository.signIn('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await repository.signUp('test@example.com', 'password123', 'Test User', 'Test City');

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
            city: 'Test City',
          },
        },
      });
      expect(result).toEqual({
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      });
    });
  });

  describe('getProfile', () => {
    it('should get profile successfully', async () => {
      const mockProfile: Profile = {
        id: 'test-id',
        name: 'Test User',
        city: 'Test City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      const result = await repository.getProfile('test-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(result).toEqual(mockProfile);
    });

    it('should throw error when profile not found', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Profile not found'),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      await expect(repository.getProfile('test-id')).rejects.toThrow('Profile not found');
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
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

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      const result = await repository.updateProfile('test-id', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockAvatarUrl = 'https://example.com/avatar.jpg';

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: mockAvatarUrl },
        }),
      });

      const result = await repository.uploadAvatar('test-id', mockFile);

      expect(mockSupabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(result).toBe(mockAvatarUrl);
    });

    it('should throw error on upload failure', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const error = new Error('Upload failed');

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          error,
        }),
      });

      await expect(repository.uploadAvatar('test-id', mockFile)).rejects.toThrow('Upload failed');
    });
  });

  describe('getSession', () => {
    it('should get session successfully', async () => {
      const mockSession = { user: { id: 'test-id' } };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await repository.getSession();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });
  });

  describe('onAuthStateChange', () => {
    it('should set up auth state change listener', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const unsubscribe = repository.onAuthStateChange(mockCallback);

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
