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

describe('Bitacora API Tests', () => {
    test('GET /api/bitacora returns actions as JSON', async () => {
        await api
            .get('/api/bitacora')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('GET /api/bitacora without token fails with 401', async () => {
        await api
            .get('/api/bitacora')
            .expect(401);
    });

});

afterAll(() => {
    server.close();
});