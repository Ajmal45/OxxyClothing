import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { AdminUser } from '../models/AdminUser.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { ROLES, ANALYTICS_EVENTS } from '../utils/constants.js';

let token = '';
let categoryId = '';
let productId = '';

beforeAll(async () => {
    // Setup in-memory DB or test DB in a real scenario
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/oxxy_test');
    
    // Clean DB
    await AdminUser.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await AnalyticsEvent.deleteMany();

    // Create Admin
    const admin = await AdminUser.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        passwordHash: 'Password123!',
        role: ROLES.SUPER_ADMIN
    });

    const category = await Category.create({
        name: 'Test Category',
        slug: 'test-category'
    });
    categoryId = category._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication & Protected Routes', () => {
    it('Should login and return a JWT cookie', async () => {
        const res = await request(app)
            .post('/api/admin/auth/login')
            .send({ email: 'test@admin.com', password: 'Password123!' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeDefined();
        // Extract token from cookie for future requests
        const cookies = res.headers['set-cookie'];
        token = cookies[0].split(';')[0].split('=')[1];
    });

    it('Should block access to protected route without token', async () => {
        const res = await request(app).get('/api/admin/auth/me');
        expect(res.statusCode).toEqual(401);
    });

    it('Should access protected route with token', async () => {
        const res = await request(app)
            .get('/api/admin/auth/me')
            .set('Cookie', `jwt=${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.email).toEqual('test@admin.com');
    });
});

describe('Product Management', () => {
    it('Should create a product with valid data', async () => {
        const res = await request(app)
            .post('/api/admin/products')
            .set('Cookie', `jwt=${token}`)
            .send({
                name: 'Test Product',
                productCode: 'TEST-01',
                description: 'Test description',
                price: 100,
                category: categoryId,
                variants: [
                    { size: 'M', color: 'Blue', stock: 10 }
                ]
            });
        
        expect(res.statusCode).toEqual(201);
        productId = res.body.data._id;
    });

    it('Should fail to create a product with duplicate variants', async () => {
        const res = await request(app)
            .post('/api/admin/products')
            .set('Cookie', `jwt=${token}`)
            .send({
                name: 'Test Product 2',
                productCode: 'TEST-02',
                description: 'Test description',
                price: 100,
                category: categoryId,
                variants: [
                    { size: 'M', color: 'Blue', stock: 10 },
                    { size: 'M', color: 'Blue', stock: 5 } // Duplicate
                ]
            });
        
        expect(res.statusCode).toEqual(400); // Handled by Mongoose pre-validate hook or Error Middleware
    });

    it('Should update a product', async () => {
        const res = await request(app)
            .put(`/api/admin/products/${productId}`)
            .set('Cookie', `jwt=${token}`)
            .send({ price: 150 });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.price).toEqual(150);
    });

    it('Should soft delete a product', async () => {
        const res = await request(app)
            .delete(`/api/admin/products/${productId}`)
            .set('Cookie', `jwt=${token}`);
        
        expect(res.statusCode).toEqual(200);

        // Verify it is not in public API
        const publicRes = await request(app).get('/api/products');
        expect(publicRes.body.data.length).toEqual(0); // Because it is deleted
    });

    it('Should restore a soft deleted product', async () => {
        const res = await request(app)
            .patch(`/api/admin/products/${productId}/restore`)
            .set('Cookie', `jwt=${token}`);
        
        expect(res.statusCode).toEqual(200);

        // Verify it is in public API
        const publicRes = await request(app).get('/api/products');
        expect(publicRes.body.data.length).toEqual(1); 
    });

    it('Should filter products by category', async () => {
        const publicRes = await request(app).get(`/api/products?category=test-category`);
        expect(publicRes.statusCode).toEqual(200);
        expect(publicRes.body.data.length).toEqual(1);
    });

    it('Should permanently delete a product', async () => {
        const res = await request(app)
            .delete(`/api/admin/products/${productId}/permanent`)
            .set('Cookie', `jwt=${token}`);
        
        expect(res.statusCode).toEqual(200);

        const checkRes = await request(app)
            .get(`/api/admin/products/${productId}`)
            .set('Cookie', `jwt=${token}`);
        expect(checkRes.statusCode).toEqual(404);
    });
});

describe('Analytics API', () => {
    it('Should create an analytics event (Product View)', async () => {
        const res = await request(app)
            .post('/api/analytics/events')
            .send({
                eventType: ANALYTICS_EVENTS.PRODUCT_VIEW
            });
        
        expect(res.statusCode).toEqual(201);
    });
});
