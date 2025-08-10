import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/infrastructure/stores/authStore';
import { useSignIn, useSignUp, useUpdateProfile } from '@/infrastructure/hooks/useAuth';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { AuthUseCases } from '@/domain/usecases/auth/AuthUseCases';
import { AuthRepository } from '@/domain/repositories/AuthRepository';

// Mock the repository
jest.mock('@/infrastructure/repositories/SupabaseAuthRepository');
jest.mock('@/domain/usecases/auth/AuthUseCases');

const MockSupabaseAuthRepository = SupabaseAuthRepository as jest.MockedClass<typeof SupabaseAuthRepository>;
const MockAuthUseCases = AuthUseCases as jest.MockedClass<typeof AuthUseCases>;

// Helper function to render hooks with providers
const renderHookWithProviders = <TProps, TResult>(
  hook: (props: TProps) => TResult
): ReturnType<typeof renderHook<TProps, TResult>> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  });
};

describe('Auth Store', () => {
  let mockRepository: jest.Mocked<AuthRepository>;
  let mockUseCases: jest.Mocked<AuthUseCases>;

  beforeEach(() => {
    mockRepository = {
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
    } as jest.Mocked<AuthRepository>;

    mockUseCases = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      uploadAvatar: jest.fn(),
    } as jest.Mocked<AuthUseCases>;

    MockSupabaseAuthRepository.mockImplementation(() => mockRepository);
    MockAuthUseCases.mockImplementation(() => mockUseCases);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuthStore', () => {
    it('initializes with default state', () => {
      const { result } = renderHookWithProviders(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('signs in successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockUseCases.signIn.mockResolvedValue(mockUser);

      const { result } = renderHookWithProviders(() => useAuthStore());

      await result.current.signIn('test@example.com', 'password123');

      expect(mockUseCases.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('handles sign in error', async () => {
      const error = new Error('Invalid credentials');
      mockUseCases.signIn.mockRejectedValue(error);

      const { result } = renderHookWithProviders(() => useAuthStore());

      await expect(result.current.signIn('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.loading).toBe(false);
    });

    it('signs up successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockUseCases.signUp.mockResolvedValue(mockUser);

      const { result } = renderHookWithProviders(() => useAuthStore());

      await result.current.signUp('test@example.com', 'password123', 'Test User', 'Test City');

      expect(mockUseCases.signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User', 'Test City');
      expect(result.current.user).toEqual(mockUser);
    });

    it('updates profile successfully', async () => {
      const mockProfile = {
        id: 'test-id',
        name: 'Updated Name',
        city: 'Updated City',
        role: 'adoptante' as const,
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      // Set initial user
      const { result } = renderHookWithProviders(() => useAuthStore());
      result.current.user = { id: 'test-id', email: 'test@example.com', created_at: '2024-01-01T00:00:00Z' };

      mockUseCases.updateProfile.mockResolvedValue(mockProfile);

      await result.current.updateProfile({ name: 'Updated Name', city: 'Updated City' });

      expect(mockUseCases.updateProfile).toHaveBeenCalledWith('test-id', { name: 'Updated Name', city: 'Updated City' });
      expect(result.current.profile).toEqual(mockProfile);
    });

    it('uploads avatar successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockAvatarUrl = 'https://example.com/avatar.jpg';

      // Set initial user and profile
      const { result } = renderHookWithProviders(() => useAuthStore());
      result.current.user = { id: 'test-id', email: 'test@example.com', created_at: '2024-01-01T00:00:00Z' };
      result.current.profile = {
        id: 'test-id',
        name: 'Test User',
        city: 'Test City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockUseCases.uploadAvatar.mockResolvedValue(mockAvatarUrl);

      await result.current.uploadAvatar(mockFile);

      expect(mockUseCases.uploadAvatar).toHaveBeenCalledWith('test-id', mockFile);
      expect(result.current.profile?.avatar_url).toBe(mockAvatarUrl);
    });

    it('signs out successfully', async () => {
      // Set initial state
      const { result } = renderHookWithProviders(() => useAuthStore());
      result.current.user = { id: 'test-id', email: 'test@example.com', created_at: '2024-01-01T00:00:00Z' };
      result.current.profile = { id: 'test-id', name: 'Test', city: 'Test', role: 'adoptante', verified: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' };
      result.current.session = { user: { id: 'test-id' } };

      mockUseCases.signOut.mockResolvedValue();

      await result.current.signOut();

      expect(mockUseCases.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  describe('React Query Hooks', () => {
    it('useSignIn returns mutation', () => {
      const { result } = renderHookWithProviders(() => useSignIn());

      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });

    it('useSignUp returns mutation', () => {
      const { result } = renderHookWithProviders(() => useSignUp());

      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });

    it('useUpdateProfile returns mutation', () => {
      const { result } = renderHookWithProviders(() => useUpdateProfile());

      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });
});
