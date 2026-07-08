import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
    try {
        // Configure Services
        await connectDB();
        configureCloudinary();
        
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

// Handle graceful shutdown
const gracefulShutdown = () => {
    console.log('SIGTERM/SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('HTTP server closed.');
        // Mongoose close connection logic will go here
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
