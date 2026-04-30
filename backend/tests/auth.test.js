const request = require('supertest');
const app     = require('../src/index');

describe('Auth API', () => {

  describe('POST /api/auth/login', () => {
    test('returns token on valid FE credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'fe@demo.com', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.success).toBe(true);
    });

    test('returns token on valid BE credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'be@demo.com', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'fe@demo.com', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    test('rejects unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@demo.com', password: 'password123' });
      expect(res.status).toBe(401);
    });

    test('rejects missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'fe@demo.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/profile', () => {
    test('returns profile with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'be@demo.com', password: 'password123' });
      const token = loginRes.body.token;

      const profileRes = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(profileRes.status).toBe(200);
      expect(profileRes.body.user.email).toBe('be@demo.com');
    });

    test('rejects request without token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('logs out with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'fe@demo.com', password: 'password123' });
      const token = loginRes.body.token;

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
    });

    test('rejects logout without token', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    test('health check returns ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

});
