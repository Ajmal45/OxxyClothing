import http from 'http';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Create server using app
const server = http.createServer(app);

// Add diagnostic logging
server.on('error', (err) => {
    console.error('SERVER ERROR:', err.message, err.stack);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT:', err.message, err.stack);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED:', reason);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
