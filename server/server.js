require('dotenv').config();
const express = require('express');
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Cloudant client
const cloudant = CloudantV1.newInstance({
  authenticator: new (require('ibm-cloud-sdk-core').IamAuthenticator)({
    apikey: process.env.CLOUDANT_APIKEY
  }),
  serviceUrl: process.env.CLOUDANT_URL
});

const dbName = process.env.CLOUDANT_DB || 'tasks';

// Health check
app.get('/health', async (req, res) => {
  try {
    await cloudant.getDatabaseInformation({ db: dbName });
    res.json({ status: 'ok', db: dbName });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
})

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await cloudant.postAllDocs({ db: dbName, includeDocs: true });
    res.json(result.result.rows.map(r => r.doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
app.post('/tasks', async (req, res) => {
  try {
    const task = { ...req.body, createdAt: new Date().toISOString() };
    const result = await cloudant.postDocument({ db: dbName, document: task });
    res.status(201).json({ id: result.result.id, ...task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await cloudant.getDocument({ db: dbName, docId: id });
    const updated = { ...existing.result, ...req.body };
    const result = await cloudant.putDocument({ db: dbName, docId: id, document: updated });
    res.json({ id: result.result.id, ...updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await cloudant.getDocument({ db: dbName, docId: id });
    await cloudant.deleteDocument({ db: dbName, docId: id, rev: existing.result._rev });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a Registry to register metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // collects default Node.js metrics

// Optional: add custom metric
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on : localhost:${port}`));
