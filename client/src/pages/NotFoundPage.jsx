import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { updateSEO } from '../utils/seo';

const NotFoundPage = () => {
    useEffect(() => {
        updateSEO({ title: 'Page Not Found', description: 'The page you are looking for does not exist.' });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-5 bg-oxxy-white">
            <div className="text-center max-w-md">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-oxxy-muted mb-6">Error 404</p>
                <h1 className="text-7xl md:text-8xl font-serif text-oxxy-black mb-6">OXXY</h1>
                <p className="text-lg text-oxxy-gray/70 mb-10">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-gray transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
            </Link>
                </div>
            </div>
    );
};

export default NotFoundPage;