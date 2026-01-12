import express, { json } from 'express';
import cors from 'cors';
import { db } from './db.js'; // Import the "Database" module
import path from  'path';
import fs from 'fs';

const app = express();
app.use(json());
app.use(cors());

// --- Controllers ---

// Auth Controller
app.post('/api/auth/signup', (req, res) => {
  const { fullName, username, password, school, birthdate } = req.body;
  
  // Sanitize (Backend Side)
  if (/[<>\/]/.test(username)) return res.status(400).json({ error: 'Invalid characters' });

  const users = db.getUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username taken' });
  }

  db.saveUser({ id: Date.now().toString(), fullName, username, password, school, birthdate });
  res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.getUsers().find(u => u.username === username && u.password === password);
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const { password: _, ...userInfo } = user;
  res.json({ token: 'offline-session', user: userInfo });
});

const COURSES_DIR = path.join(process.cwd(), 'backend', 'data', 'courses');

// Helper: Read all lesson files and merge them
const getAllLessons = () => {
  let allLessons = [];
  try {
    if (!fs.existsSync(COURSES_DIR)) return [];
    
    const files = fs.readdirSync(COURSES_DIR);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const data = fs.readFileSync(path.join(COURSES_DIR, file), 'utf8');
        const lessons = JSON.parse(data);
        allLessons = [...allLessons, ...lessons];
      }
    });
  } catch (e) {
    console.error("Error reading lessons:", e);
  }
  return allLessons;
};
app.get('/api/lessons', (req, res) => {
  const lessons = getAllLessons();
  
  const lightList = lessons.map(l => ({
    id: l.id,
    title: l.title,
    excerpt: l.excerpt,
    category: l.category // Useful for filtering later
  }));
  
  res.json(lightList);
});
app.get('/api/lessons/:id', (req, res) => {
  const { id } = req.params;
  const lessons = getAllLessons();
  const lesson = lessons.find(l => l.id === id);
  
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  
  res.json(lesson);
});

// ... (Add other endpoints using db helper)

const port = 4000;
app.listen(port, () => console.log(`Server structured & running on ${port}`));