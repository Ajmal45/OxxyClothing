import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Package, FolderOpen, Grid3X3, Home,
    Settings, MessageSquare, Trash2, Menu, X, LogOut, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui';

const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: Grid3X3, label: 'Categories' },
    { to: '/admin/collections', icon: FolderOpen, label: 'Collections' },
    { to: '/admin/homepage', icon: Home, label: 'Homepage' },
    { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/trash', icon: Trash2, label: 'Trash' },
];

const SidebarContent = ({ onNavClick }) => {
    const { user, logout } = useAuth();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/';
        } catch {
            toast({ message: 'Logout failed. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black flex-shrink-0">
                    <span className="text-white font-bold text-sm tracking-widest">O</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">OXXY</p>
                    <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Main navigation">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                                isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                        }
                    >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                        <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Get current page title from navItems
    const currentNav = navItems.find((n) => location.pathname.startsWith(n.to));
    const pageTitle = currentNav?.label ?? 'Admin';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="fixed top-0 left-0 z-50 w-72 h-full lg:hidden"
                        >
                            <SidebarContent onNavClick={() => setMobileOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="flex items-center h-14 px-4 sm:px-6 bg-white border-b border-gray-200 flex-shrink-0">
                    <button
                        className="lg:hidden mr-3 text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>OXXY</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="font-medium text-gray-900">{pageTitle}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
