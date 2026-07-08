import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { injectJsonLd, getOrganizationSchema, getWebsiteSchema } from './utils/jsonld';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import StorefrontLayout from './components/storefront/layout/StorefrontLayout';
import { Spinner } from './components/ui';

const PageLoader = () => (
    <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8 text-black" />
    </div>
);

const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProductListPage = lazy(() => import('./pages/admin/ProductListPage'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const CategoryPage = lazy(() => import('./pages/admin/CategoryPage'));
const CollectionPage = lazy(() => import('./pages/admin/CollectionPage'));
const HomepageCMSPage = lazy(() => import('./pages/admin/HomepageCMSPage'));
const EnquiriesPage = lazy(() => import('./pages/admin/EnquiriesPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const TrashPage = lazy(() => import('./pages/admin/TrashPage'));

const App = () => {
    useEffect(() => {
        injectJsonLd([getOrganizationSchema(), getWebsiteSchema()]);
    }, []);

    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route element={<StorefrontLayout />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/collections" element={<CollectionsPage />} />
                                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                                <Route path="/product/:slug" element={<ProductDetailPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/privacy" element={<PrivacyPage />} />
                            </Route>

                            <Route path="/admin/login" element={<LoginPage />} />

                            <Route element={<ProtectedRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                                    <Route path="/admin/products" element={<ProductListPage />} />
                                    <Route path="/admin/products/create" element={<ProductFormPage />} />
                                    <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
                                    <Route path="/admin/categories" element={<CategoryPage />} />
                                    <Route path="/admin/collections" element={<CollectionPage />} />
                                    <Route path="/admin/homepage" element={<HomepageCMSPage />} />
                                    <Route path="/admin/enquiries" element={<EnquiriesPage />} />
                                    <Route path="/admin/settings" element={<SettingsPage />} />
                                    <Route path="/admin/trash" element={<TrashPage />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
