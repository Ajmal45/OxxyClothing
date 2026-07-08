import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            const message = err?.response?.data?.message || 'Login failed. Please try again.';
            toast({ message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                {/* Logo + Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-black mb-4">
                        <span className="text-white font-bold text-lg tracking-widest">O</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">OXXY Admin</h1>
                    <p className="mt-1 text-sm text-gray-500">Sign in to manage your store</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@oxxy.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    error={errors.password?.message}
                                    className="pr-10"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isSubmitting}
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    OXXY — Complete Women Store &copy; {new Date().getFullYear()}
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
