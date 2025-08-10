import { http, HttpResponse } from 'msw';

// Mock data for pets
const mockPets = [
  {
    id: 1,
    name: 'Luna',
    type: 'dog',
    breed: 'Golden Retriever',
    description: 'Friendly and energetic dog',
    location: { lat: 19.4326, lng: -99.1332 },
    found_date: '2024-01-15',
    status: 'found',
  },
  {
    id: 2,
    name: 'Mittens',
    type: 'cat',
    breed: 'Persian',
    description: 'Calm and affectionate cat',
    location: { lat: 19.4326, lng: -99.1332 },
    found_date: '2024-01-10',
    status: 'lost',
  },
];

// Mock data for users
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
    });
  }),

  // Mock Supabase pets table
  http.get('*/rest/v1/pets', () => {
    return HttpResponse.json(mockPets);
  }),

  http.post('*/rest/v1/pets', async ({ request }) => {
    const newPet = await request.json();
    return HttpResponse.json({ ...newPet, id: Date.now() });
  }),

  http.get('*/rest/v1/pets/:id', ({ params }) => {
    const pet = mockPets.find(p => p.id === Number(params.id));
    return pet
      ? HttpResponse.json(pet)
      : new HttpResponse(null, { status: 404 });
  }),

  // Mock Supabase users table
  http.get('*/rest/v1/users', () => {
    return HttpResponse.json(mockUsers);
  }),

  // Mock file upload
  http.post('*/storage/v1/object', () => {
    return HttpResponse.json({
      path: 'pets/mock-image.jpg',
      fullPath: 'https://example.com/pets/mock-image.jpg',
    });
  }),
];
