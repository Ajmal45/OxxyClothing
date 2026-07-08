import express from 'express';
import {
    getPublicProducts,
    getNewArrivals,
    getFeaturedProducts,
    getProductBySlug,
    getPublicCategories,
    getPublicCollections,
    getCollectionBySlug,
    getPublicHomepage,
    getPublicSettings
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/products', getPublicProducts);
router.get('/products/new-arrivals', getNewArrivals);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/:slug', getProductBySlug);

router.get('/categories', getPublicCategories);

router.get('/collections', getPublicCollections);
router.get('/collections/:slug', getCollectionBySlug);

router.get('/homepage', getPublicHomepage);

router.get('/settings/public', getPublicSettings);

export default router;
