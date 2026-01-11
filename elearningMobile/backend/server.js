// Minimal Express stub demonstrating expected endpoints for frontend integration.
import express, { json } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(json());

function loadLessons() {
  try {
    const p = path.join(process.cwd(), 'backend', 'data', 'lessons.json');
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({ token: 'mock-token', user: { id: 'u1', email } });
});

app.post('/api/auth/signup', (req, res) => {
  const { email } = req.body;
  res.json({ token: 'mock-token', user: { id: 'u2', email } });
});

app.get('/api/lessons', (req, res) => {
  const lessons = loadLessons();
  const list = lessons.map(({ id, title, excerpt }) => ({ id, title, excerpt }));
  res.json(list);
});

app.get('/api/lessons/:id', (req, res) => {
  const lessons = loadLessons();
  const item = lessons.find((l) => l.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/assessments/submit', (req, res) => {
  res.json({ score: 100, passed: true });
});

app.get('/api/progress', (req, res) => {
  res.json({ dailyPoints: 0, lastLessonId: null });
});

app.post('/api/progress', (req, res) => {
  const payload = req.body || {};
  try {
    const outPath = path.join(process.cwd(), 'backend', 'data', 'progress.json');
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
    return res.json({ ok: true, saved: payload });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend stub listening on http://localhost:${port}`));
