const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';
const api = supertest(app);
let token;

beforeAll(() => {
    token = GeneraToken(email, password, role);
});

describe('Auth API Tests', () => {
    test('POST /api/auth/ returns a token', async () => {
        await api
            .post('/api/auth')
            .send({ email, password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then((response) => {
                expect(response.body.jwt).toBeDefined();
            });
    });

    test('POST /api/auth/ with invalid credentials fails with 401', async () => {
        await api
            .post('/api/auth')
            .send({ email: email, password: 'invalid' })
            .expect(404);
    });

});

afterAll(() => {
    server.close();
});