export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: 'adoptante' | 'publicador' | 'admin';
  name: string;
  city: string;
  avatar_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: unknown | null;
  loading: boolean;
  error: string | null;
}
