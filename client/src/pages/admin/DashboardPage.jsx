import { useState, useEffect } from 'react';
import {
    Package, CheckCircle, XCircle, Star, Sparkles,
    FolderOpen, MessageSquare, TrendingUp, Clock
} from 'lucide-react';
import { StatCard, PageHeader, ErrorState } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { analyticsService, productService, collectionService } from '../../services/apiServices';
import { Badge } from '../../components/ui';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [overviewRes, topProductsRes, allProductsRes, collectionsRes] = await Promise.all([
                    analyticsService.getOverview(),
                    analyticsService.getProducts(),
                    productService.getAll({ limit: 5, sort: 'newest' }),
                    collectionService.getAll(),
                ]);

                const allData = allProductsRes.data;
                const pagination = allData.pagination;

                setOverview(overviewRes.data.data);
                setTopProducts(topProductsRes.data.data || []);
                setRecentProducts(allData.data || []);

                // Compute stat cards
                const [availableRes, unavailableRes, featuredRes, newArrivalRes] = await Promise.all([
                    productService.getAll({ limit: 1, isAvailable: 'true' }),
                    productService.getAll({ limit: 1, isAvailable: 'false' }),
                    productService.getAll({ limit: 1, isFeatured: 'true' }),
                    productService.getAll({ limit: 1, isNewArrival: 'true' }),
                ]);

                setStats({
                    total: pagination?.total ?? 0,
                    available: availableRes.data.pagination?.total ?? 0,
                    unavailable: unavailableRes.data.pagination?.total ?? 0,
                    featured: featuredRes.data.pagination?.total ?? 0,
                    newArrivals: newArrivalRes.data.pagination?.total ?? 0,
                    collections: collectionsRes.data.data?.length ?? 0,
                    whatsappClicks: overviewRes.data.data?.totalWhatsAppClicks ?? 0,
                });
            } catch (err) {
                setError('Failed to load dashboard data. Make sure the server is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner className="h-8 w-8 text-black" />
            </div>
        );
    }

    if (error) {
        return <ErrorState title="Dashboard Error" description={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Overview of your store's performance and recent activity"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Products" value={stats?.total} icon={Package} />
                <StatCard label="Available" value={stats?.available} icon={CheckCircle} description="In-stock variants" />
                <StatCard label="Unavailable" value={stats?.unavailable} icon={XCircle} description="Out of stock" />
                <StatCard label="Collections" value={stats?.collections} icon={FolderOpen} />
                <StatCard label="Featured" value={stats?.featured} icon={Star} />
                <StatCard label="New Arrivals" value={stats?.newArrivals} icon={Sparkles} />
                <StatCard label="WhatsApp Enquiries" value={stats?.whatsappClicks} icon={MessageSquare} description="All-time clicks" />
                <StatCard label="Total Views" value={overview?.totalEvents} icon={TrendingUp} description="All events tracked" />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Most Viewed Products</h2>
                    </div>
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No view data yet.</p>
                    ) : (
                        <ol className="space-y-3">
                            {topProducts.map((p, i) => (
                                <li key={p._id} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-300 w-5">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {p.productDetails?.name ?? 'Unknown Product'}
                                        </p>
                                        <p className="text-xs text-gray-400">{p.productDetails?.productCode}</p>
                                    </div>
                                    <Badge variant="default">{p.views} views</Badge>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Recently Added Products</h2>
                    </div>
                    {recentProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No products yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentProducts.map((p) => (
                                <li key={p._id} className="flex items-center gap-3">
                                    {p.images?.[0]?.url ? (
                                        <img
                                            src={p.images[0].url}
                                            alt={p.images[0].altText || p.name}
                                            className="h-10 w-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <Package className="h-4 w-4 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.productCode}</p>
                                    </div>
                                    <Badge variant={p.isAvailable ? 'success' : 'warning'}>
                                        {p.isAvailable ? 'Available' : 'Unavailable'}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Recent Views Chart (simple bar representation) */}
            {overview?.recentProductViews?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Product Views — Last 7 Days</h2>
                    <div className="flex items-end gap-2 h-24">
                        {[...overview.recentProductViews].reverse().map((d) => {
                            const max = Math.max(...overview.recentProductViews.map((x) => x.count));
                            const heightPct = max > 0 ? Math.round((d.count / max) * 100) : 0;
                            return (
                                <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-400">{d.count}</span>
                                    <div
                                        className="w-full bg-black rounded-t"
                                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                                    />
                                    <span className="text-xs text-gray-400 truncate w-full text-center">
                                        {d._id?.slice(5)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
