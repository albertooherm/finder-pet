import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock data
const mockPets = [
  {
    id: 1,
    name: 'Luna',
    type: 'dog',
    breed: 'Golden Retriever',
    status: 'found',
  },
];

// Setup MSW server for this test file
const server = setupServer(
  http.get('*/rest/v1/pets', () => {
    return HttpResponse.json(mockPets);
  }),

  http.post('*/rest/v1/pets', async ({ request }) => {
    const newPet = await request.json();
    return HttpResponse.json({ ...newPet, id: Date.now() });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration Tests', () => {
  it('fetches pets successfully', async () => {
    const response = await fetch('https://api.supabase.co/rest/v1/pets');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPets);
    expect(data[0].name).toBe('Luna');
  });

  it('creates a new pet successfully', async () => {
    const newPet = {
      name: 'Buddy',
      type: 'dog',
      breed: 'Labrador',
      status: 'lost',
    };

    const response = await fetch('https://api.supabase.co/rest/v1/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPet),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Buddy');
    expect(data.id).toBeDefined();
  });

  it('handles API errors gracefully', async () => {
    // Override the handler to simulate an error
    server.use(
      http.get('*/rest/v1/pets', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const response = await fetch('https://api.supabase.co/rest/v1/pets');

    expect(response.status).toBe(500);
  });
});
