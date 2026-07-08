import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdminUser } from '../models/AdminUser.js';
import { ROLES } from '../utils/constants.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@oxxy.com';
        const existingAdmin = await AdminUser.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const admin = new AdminUser({
            name: process.env.DEFAULT_ADMIN_NAME || 'Super Admin',
            email: adminEmail,
            passwordHash: process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123!',
            role: ROLES.SUPER_ADMIN
        });

        await admin.save();
        console.log(`Admin user created successfully with email: ${adminEmail}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
