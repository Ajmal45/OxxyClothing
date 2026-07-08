import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT:', err.message, err.stack);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED:', reason);
});

const startServer = async () => {
    try {
        await connectDB();
        configureCloudinary();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
