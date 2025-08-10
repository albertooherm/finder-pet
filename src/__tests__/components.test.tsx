import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuthStore } from '@/infrastructure/stores/authStore';
import { useUpdateProfile, useUploadAvatar } from '@/infrastructure/hooks/useAuth';

// Mock the auth store
jest.mock('@/infrastructure/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the auth hooks
jest.mock('@/infrastructure/hooks/useAuth', () => ({
  useUpdateProfile: jest.fn(),
  useUploadAvatar: jest.fn(),
}));

const mockUseAuthStore = jest.mocked(useAuthStore);
const mockUseUpdateProfile = jest.mocked(useUpdateProfile);
const mockUseUploadAvatar = jest.mocked(useUploadAvatar);

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

describe('ProfileForm Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      profile: {
        id: 'test-user-id',
        name: 'Test User',
        city: 'Test City',
        role: 'adoptante',
        verified: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    });

    mockUseUpdateProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseUploadAvatar.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('renders profile form correctly', () => {
    renderWithProviders(<ProfileForm />);

    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    expect(screen.getByText('adoptante')).toBeInTheDocument();
  });

  it('allows editing profile information', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = jest.fn();
    mockUseUpdateProfile.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    renderWithProviders(<ProfileForm />);

    const nameInput = screen.getByDisplayValue('Test User');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
    await user.click(saveButton);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: 'Updated Name',
      city: 'Test City',
    });
  });

  it('shows loading state during update', () => {
    mockUseUpdateProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWithProviders(<ProfileForm />);

    expect(screen.getByText('Guardando...')).toBeInTheDocument();
  });

  it('handles avatar upload', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = jest.fn();
    mockUseUploadAvatar.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    renderWithProviders(<ProfileForm />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/avatar/i);
    
    await user.upload(fileInput, file);

    expect(mockMutateAsync).toHaveBeenCalledWith(file);
  });
});
