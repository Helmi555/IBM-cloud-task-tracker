const request = require('supertest');
const app = require('../server');

jest.mock('@ibm-cloud/cloudant', () => {
  return {
    CloudantV1: {
      newInstance: jest.fn(() => ({
        getDatabaseInformation: jest.fn().mockResolvedValue({}),
        postAllDocs: jest.fn().mockResolvedValue({
          result: { rows: [{ doc: { id: '1', title: 'Task 1' } }] }
        }),
        postDocument: jest.fn().mockResolvedValue({
          result: { id: '123' }
        }),
        getDocument: jest.fn().mockResolvedValue({
          result: { _rev: '1-abc', title: 'Test Task' }
        }),
        putDocument: jest.fn().mockResolvedValue({
          result: { ok: true }
        }),
        deleteDocument: jest.fn().mockResolvedValue({
          result: { ok: true }
        })
      }))
    }
  };
});

describe('Task Tracker API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000); // Start server on test port
  });

  afterAll((done) => {
    server.close(done); // Properly close server after tests
  });

  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /tasks returns array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /tasks creates task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'New Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Task');
  });

  it('PUT /tasks/:id updates task', async () => {
    const res = await request(app)
      .put('/tasks/123')
      .send({ title: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('DELETE /tasks/:id removes task', async () => {
    const res = await request(app).delete('/tasks/123');
    expect(res.statusCode).toBe(204);
  });
});