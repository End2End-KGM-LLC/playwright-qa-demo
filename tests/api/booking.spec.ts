import { test, expect, type APIRequestContext } from '@playwright/test';
import { bookerAdmin, sampleBooking } from '../../fixtures/test-data';

// Booking API tests against restful-booker. No browser is launched; requests go
// to API_BASE_URL. Each test creates its own booking so tests stay independent.

const json = { Accept: 'application/json' };

async function createBooking(request: APIRequestContext): Promise<number> {
  const response = await request.post('/booking', { data: sampleBooking, headers: json });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { bookingid: number };
  return body.bookingid;
}

async function authToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth', { data: bookerAdmin });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { token?: string };
  expect(body.token, 'auth should return a token').toBeTruthy();
  return body.token ?? '';
}

test.describe('Booking API', () => {
  test('health check responds @smoke', async ({ request }) => {
    const response = await request.get('/ping');

    expect(response.status()).toBe(201);
  });

  test('created booking can be read back', async ({ request }) => {
    const id = await createBooking(request);

    const response = await request.get(`/booking/${id}`, { headers: json });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(sampleBooking);
  });

  test('authorised user can update a booking', async ({ request }) => {
    const id = await createBooking(request);
    const token = await authToken(request);

    const response = await request.patch(`/booking/${id}`, {
      headers: { ...json, Cookie: `token=${token}` },
      data: { totalprice: 300, additionalneeds: 'Breakfast' },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ totalprice: 300, additionalneeds: 'Breakfast' });
  });

  test('delete without a token is refused', async ({ request }) => {
    const id = await createBooking(request);

    const response = await request.delete(`/booking/${id}`);

    expect(response.status()).toBe(403);
  });

  test('authorised delete removes the booking', async ({ request }) => {
    const id = await createBooking(request);
    const token = await authToken(request);

    const deleted = await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleted.status()).toBe(201);

    const lookup = await request.get(`/booking/${id}`, { headers: json });
    expect(lookup.status()).toBe(404);
  });
});
