'use strict';

const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ─── Config ─────────────────────────────────────────────────────────────────
const PORT = 3000;
const VOICEBOX_URL = 'http://127.0.0.1:17493';
const DATA_DIR = path.join(__dirname, 'data');
const GENERATIONS_DIR = path.join(DATA_DIR, 'generations');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

// Ensure directories exist
[DATA_DIR, GENERATIONS_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Multer (uploads to memory, forwarded to Voicebox) ──────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// ─── In-memory session store ─────────────────────────────────────────────────
const sessions = new Map(); // token → { username, displayName }

function getStudents() {
  return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf-8'));
}

// ─── Auth middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.headers['x-session-token'] || req.query.token;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorised. Please log in.' });
  }
  req.student = sessions.get(token);
  next();
}

// ─── FIFO Generation Queue ────────────────────────────────────────────────────
const queue = [];          // Array of job objects
let activeJob = null;      // Currently processing job
const queueListeners = new Map(); // jobId → SSE response

function broadcastPositions() {
  queue.forEach((job, idx) => {
    const res = queueListeners.get(job.id);
    if (res) {
      res.write(`data: ${JSON.stringify({ status: 'queued', position: idx + 1, total: queue.length })}\n\n`);
    }
  });
}

async function processQueue() {
  if (activeJob || queue.length === 0) return;

  activeJob = queue.shift();
  broadcastPositions();

  const res = queueListeners.get(activeJob.id);
  if (res) res.write(`data: ${JSON.stringify({ status: 'generating' })}\n\n`);

  try {
    const vbRes = await fetch(`${VOICEBOX_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeJob.payload),
    });

    if (!vbRes.ok) {
      const err = await vbRes.text();
      throw new Error(err);
    }

    const genData = await vbRes.json();
    const generationId = genData.generation_id || genData.id;

    // Poll Voicebox for completion
    await waitForCompletion(generationId, activeJob.id);

    // Download and save the audio file
    const audioRes = await fetch(`${VOICEBOX_URL}/audio/${generationId}`);
    const audioBuffer = await audioRes.buffer();

    const studentDir = path.join(GENERATIONS_DIR, activeJob.username);
    fs.mkdirSync(studentDir, { recursive: true });

    const filename = `${Date.now()}_${generationId}.wav`;
    const audioPath = path.join(studentDir, filename);
    fs.writeFileSync(audioPath, audioBuffer);

    // Save metadata
    const meta = {
      generationId,
      filename,
      text: activeJob.payload.text,
      profileId: activeJob.payload.profile_id,
      profileName: activeJob.profileName || 'Unknown',
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(audioPath.replace('.wav', '.json'), JSON.stringify(meta, null, 2));

    if (res) {
      res.write(`data: ${JSON.stringify({ status: 'complete', generationId, filename })}\n\n`);
      res.end();
    }
  } catch (err) {
    console.error('Queue job error:', err.message);
    if (res) {
      res.write(`data: ${JSON.stringify({ status: 'error', message: err.message })}\n\n`);
      res.end();
    }
  } finally {
    queueListeners.delete(activeJob.id);
    activeJob = null;
    processQueue();
  }
}

async function waitForCompletion(generationId, jobId) {
  const maxWait = 300000; // 5 minutes
  const interval = 2000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, interval));
    try {
      const statusRes = await fetch(`${VOICEBOX_URL}/generate/${generationId}/status`, {
        headers: { Accept: 'text/event-stream' },
      });
      const text = await statusRes.text();
      // Parse first SSE data line
      const match = text.match(/data:\s*({.*})/);
      if (match) {
        const data = JSON.parse(match[1]);
        if (data.status === 'completed' || data.status === 'done') return;
        if (data.status === 'failed') throw new Error('Voicebox generation failed');
      }
    } catch (e) {
      // Ignore transient errors, keep polling
    }
  }
  throw new Error('Generation timed out after 5 minutes');
}

// ─── Routes: Auth ─────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, pin } = req.body;
  if (!username || !pin) return res.status(400).json({ error: 'Username and PIN required.' });

  const students = getStudents();
  const student = students.find(
    s => s.username.toLowerCase() === username.toLowerCase() && s.pin === String(pin)
  );

  if (!student) return res.status(401).json({ error: 'Invalid username or PIN.' });

  const token = uuidv4();
  sessions.set(token, { username: student.username, displayName: student.displayName });
  res.json({ token, displayName: student.displayName });
});

app.post('/api/logout', requireAuth, (req, res) => {
  const token = req.headers['x-session-token'];
  sessions.delete(token);
  res.json({ ok: true });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ username: req.student.username, displayName: req.student.displayName });
});

// ─── Routes: Voicebox Proxy (Profiles) ───────────────────────────────────────
app.get('/api/profiles', requireAuth, async (req, res) => {
  try {
    const r = await fetch(`${VOICEBOX_URL}/profiles`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Cannot reach Voicebox API.' });
  }
});

app.post('/api/profiles', requireAuth, async (req, res) => {
  try {
    const r = await fetch(`${VOICEBOX_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Cannot reach Voicebox API.' });
  }
});

app.post('/api/profiles/:profileId/samples', requireAuth, upload.single('audio'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('audio', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    if (req.body.text) form.append('text', req.body.text);

    const r = await fetch(`${VOICEBOX_URL}/profiles/${req.params.profileId}/samples`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Cannot reach Voicebox API: ' + e.message });
  }
});

app.get('/api/profiles/:profileId/samples', requireAuth, async (req, res) => {
  try {
    const r = await fetch(`${VOICEBOX_URL}/profiles/${req.params.profileId}/samples`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Cannot reach Voicebox API.' });
  }
});

app.delete('/api/profiles/samples/:sampleId', requireAuth, async (req, res) => {
  try {
    const r = await fetch(`${VOICEBOX_URL}/profiles/samples/${req.params.sampleId}`, { method: 'DELETE' });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Cannot reach Voicebox API.' });
  }
});

// ─── Routes: Generation Queue ─────────────────────────────────────────────────
app.post('/api/generate', requireAuth, (req, res) => {
  const jobId = uuidv4();
  const position = queue.length + (activeJob ? 1 : 0) + 1;

  queue.push({
    id: jobId,
    username: req.student.username,
    payload: req.body,
    profileName: req.body.profile_name || null,
  });

  broadcastPositions();
  processQueue();

  res.json({ jobId, position });
});

// SSE endpoint — client subscribes to listen for their job
app.get('/api/generate/:jobId/events', requireAuth, (req, res) => {
  const { jobId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  queueListeners.set(jobId, res);

  // Send initial position
  const queuePos = queue.findIndex(j => j.id === jobId);
  if (activeJob && activeJob.id === jobId) {
    res.write(`data: ${JSON.stringify({ status: 'generating' })}\n\n`);
  } else if (queuePos >= 0) {
    res.write(`data: ${JSON.stringify({ status: 'queued', position: queuePos + 1, total: queue.length })}\n\n`);
  }

  req.on('close', () => queueListeners.delete(jobId));
});

// ─── Routes: Student Library ──────────────────────────────────────────────────
app.get('/api/library', requireAuth, (req, res) => {
  const studentDir = path.join(GENERATIONS_DIR, req.student.username);
  if (!fs.existsSync(studentDir)) return res.json([]);

  const files = fs.readdirSync(studentDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(studentDir, f), 'utf-8')); }
      catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(files);
});

app.get('/api/library/:filename', requireAuth, (req, res) => {
  const filePath = path.join(GENERATIONS_DIR, req.student.username, req.params.filename);
  if (!fs.existsSync(filePath) || !req.params.filename.endsWith('.wav')) {
    return res.status(404).json({ error: 'File not found.' });
  }
  res.setHeader('Content-Type', 'audio/wav');
  res.sendFile(filePath);
});

// ─── Routes: Health ───────────────────────────────────────────────────────────
app.get('/api/health', requireAuth, async (req, res) => {
  try {
    const r = await fetch(`${VOICEBOX_URL}/health`);
    const data = await r.json();
    res.json({ ...data, queueLength: queue.length, processing: !!activeJob });
  } catch {
    res.json({ status: 'voicebox_offline', queueLength: queue.length, processing: false });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const ifaces = os.networkInterfaces();
  const localIPs = Object.values(ifaces)
    .flat()
    .filter(i => i.family === 'IPv4' && !i.internal)
    .map(i => i.address);

  console.log('\n✅ Voicebox Student Studio is running!\n');
  console.log(`   Local:   http://localhost:${PORT}`);
  localIPs.forEach(ip => console.log(`   Network: http://${ip}:${PORT}  ← Share this URL with students`));
  console.log('\n   Edit data/students.json to add or remove student accounts.\n');
});
