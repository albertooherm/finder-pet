import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AuthPage } from '@/pages/AuthPage';
import { useAuthStore } from '@/infrastructure/stores/authStore';
import { useSignIn, useSignUp, useSignInWithGoogle, useResetPassword } from '@/infrastructure/hooks/useAuth';

// Mock the auth store
jest.mock('@/infrastructure/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = jest.mocked(useAuthStore);

// Mock the auth hooks
jest.mock('@/infrastructure/hooks/useAuth', () => ({
  useSignIn: jest.fn(),
  useSignUp: jest.fn(),
  useSignInWithGoogle: jest.fn(),
  useResetPassword: jest.fn(),
}));

const mockUseSignIn = jest.mocked(useSignIn);
const mockUseSignUp = jest.mocked(useSignUp);
const mockUseSignInWithGoogle = jest.mocked(useSignInWithGoogle);
const mockUseResetPassword = jest.mocked(useResetPassword);

// Setup MSW server
const server = setupServer(
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
    });
  }),
  
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        city: 'Test City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Authentication Components', () => {
  beforeEach(() => {
    // Default mock implementations
    mockUseAuthStore.mockReturnValue({
      error: null,
      clearError: jest.fn(),
    });

    mockUseSignIn.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseSignUp.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseSignInWithGoogle.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseResetPassword.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  describe('LoginForm', () => {
    it('renders login form correctly', () => {
      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      const emailInput = screen.getByPlaceholderText('Email');
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    it('validates password length', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      await user.type(passwordInput, '123');
      await user.tab();

      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockMutateAsync = jest.fn();
      mockUseSignIn.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      });

      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('shows loading state during submission', async () => {
      mockUseSignIn.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true,
      });

      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    });

    it('displays error message from store', () => {
      mockUseAuthStore.mockReturnValue({
        error: 'Invalid credentials',
        clearError: jest.fn(),
      });

      renderWithProviders(
        <LoginForm
          onSwitchToSignUp={jest.fn()}
          onSwitchToResetPassword={jest.fn()}
        />
      );

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('SignUpForm', () => {
    it('renders signup form correctly', () => {
      renderWithProviders(<SignUpForm onSwitchToLogin={jest.fn()} />);

      expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ciudad')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
    });

    it('validates password confirmation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignUpForm onSwitchToLogin={jest.fn()} />);

      await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'different');
      await user.tab();

      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockMutateAsync = jest.fn();
      mockUseSignUp.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      });

      renderWithProviders(<SignUpForm onSwitchToLogin={jest.fn()} />);

      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Test User');
      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Ciudad'), 'Test City');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'password123');
      await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        city: 'Test City',
      });
    });
  });

  describe('ResetPasswordForm', () => {
    it('renders reset password form correctly', () => {
      renderWithProviders(<ResetPasswordForm onSwitchToLogin={jest.fn()} />);

      expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar email de recuperación/i })).toBeInTheDocument();
    });

    it('shows success message after submission', async () => {
      const user = userEvent.setup();
      const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
      mockUseResetPassword.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      });

      renderWithProviders(<ResetPasswordForm onSwitchToLogin={jest.fn()} />);

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /enviar email de recuperación/i }));

      await waitFor(() => {
        expect(screen.getByText('Email Enviado')).toBeInTheDocument();
        expect(screen.getByText('Hemos enviado un enlace de recuperación a tu email')).toBeInTheDocument();
      });
    });
  });

  describe('AuthPage', () => {
    it('renders login form by default', () => {
      renderWithProviders(<AuthPage />);

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('🐾 Finder Pet')).toBeInTheDocument();
    });

    it('switches to signup form', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AuthPage />);

      await user.click(screen.getByText('Regístrate aquí'));

      expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    });

    it('switches to reset password form', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AuthPage />);

      await user.click(screen.getByText('¿Olvidaste tu contraseña?'));

      expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
    });
  });
});
