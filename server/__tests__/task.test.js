jest.mock('@ibm-cloud/cloudant', () => {
  return {
    CloudantV1: {
      newInstance: jest.fn(() => ({
        getDatabaseInformation: jest.fn().mockResolvedValue({}),
        postAllDocs: jest.fn().mockResolvedValue({ result: { rows: [] } }),
        postDocument: jest.fn().mockResolvedValue({ result: { id: '123' } }),
        getDocument: jest.fn().mockResolvedValue({ result: { _rev: '1-abc' } }),
        putDocument: jest.fn().mockResolvedValue({}),
        deleteDocument: jest.fn().mockResolvedValue({})
      }))
    }
  };
});

const request = require('supertest');
const app = require('../server');

describe('Task Tracker API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
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



  it('DELETE /tasks/:id removes task', async () => {
    const res = await request(app).delete('/tasks/123');
    expect(res.statusCode).toBe(204);
  });
});