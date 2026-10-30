import cors from 'cors';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 8787);
const root = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(root, 'data', 'progress.json');

app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'terminal-lab-api' });
});

app.get('/api/progress/:userId', async (request, response) => {
  try {
    const all = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    response.json(all[request.params.userId] || { completed: [] });
  } catch (error) {
    response.status(500).json({ error: 'Could not read progress data.' });
  }
});

app.put('/api/progress/:userId', async (request, response) => {
  const { completed } = request.body;
  if (!Array.isArray(completed) || completed.some((item) => !Number.isInteger(item))) {
    return response.status(400).json({ error: 'completed must be an array of lesson numbers.' });
  }
  try {
    const all = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    all[request.params.userId] = { completed };
    await fs.writeFile(dataFile, `${JSON.stringify(all, null, 2)}\n`);
    return response.json(all[request.params.userId]);
  } catch (error) {
    return response.status(500).json({ error: 'Could not save progress data.' });
  }
});

app.listen(port, () => console.log(`Terminal Lab API running on http://localhost:${port}`));
