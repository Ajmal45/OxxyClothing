import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT:', err.message, err.stack);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED:', reason);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
