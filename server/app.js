import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'OXXY API is running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.get('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Not Found' });
});

export default app;
