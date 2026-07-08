import { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Package, FolderOpen, ShoppingCart, Globe, Palette, Ruler, Eye } from 'lucide-react';
import { analyticsService } from '../../services/apiServices';
import { StatCard, PageHeader, EmptyState, ErrorState, Spinner, Badge, Pagination, Button, Select } from '../../components/ui';

const EnquiriesPage = () => {
    const [overview, setOverview] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [topCollections, setTopCollections] = useState([]);
    const [mostEnquired, setMostEnquired] = useState([]);
    const [trafficSources, setTrafficSources] = useState([]);
    const [sizeColorData, setSizeColorData] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsPagination, setEventsPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [eventsPage, setEventsPage] = useState(1);
    const [eventTypeFilter, setEventTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [overviewRes, productsRes, collectionsRes, enquiredRes, sourcesRes, sizeColorRes] = await Promise.all([
                    analyticsService.getOverview(),
                    analyticsService.getProducts(),
                    analyticsService.getCollections(),
                    analyticsService.getMostEnquired(),
                    analyticsService.getTrafficSources(),
                    analyticsService.getSizeColorBreakdown(),
                ]);
                setOverview(overviewRes.data.data);
                setTopProducts(productsRes.data.data || []);
                setTopCollections(collectionsRes.data.data || []);
                setMostEnquired(enquiredRes.data.data || []);
                setTrafficSources(sourcesRes.data.data || []);
                setSizeColorData(sizeColorRes.data.data || null);
            } catch {
                setError('Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const fetchEvents = async (page = 1) => {
        try {
            const params = { page, limit: 20 };
            if (eventTypeFilter) params.eventType = eventTypeFilter;
            const res = await analyticsService.getEvents(params);
            setEvents(res.data.data || []);
            setEventsPagination(res.data.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
            setEventsPage(page);
        } catch { /* silent */ }
    };

    useEffect(() => {
        if (!loading) fetchEvents(1);
    }, [eventTypeFilter, loading]);

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Enquiries & Analytics"
                description="Track WhatsApp enquiry activity, product views and collection performance"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Events" value={overview?.totalEvents} icon={TrendingUp} />
                <StatCard label="WhatsApp Clicks" value={overview?.totalWhatsAppClicks} icon={MessageSquare} description="Enquiry button clicks" />
                <StatCard label="Product Views" value={overview?.totalProductViews} icon={Eye} description="All product page views" />
                <StatCard label="Collection Views" value={overview?.totalCollectionViews} icon={FolderOpen} />
            </div>

            {/* Recent Views Chart */}
            {overview?.recentProductViews?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-5">Product Views — Last 7 Days</h2>
                    <div className="flex items-end gap-3 h-32">
                        {[...overview.recentProductViews].reverse().map((d) => {
                            const max = Math.max(...overview.recentProductViews.map((x) => x.count));
                            const heightPct = max > 0 ? Math.round((d.count / max) * 100) : 0;
                            return (
                                <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs font-medium text-gray-700">{d.count}</span>
                                    <div className="w-full bg-black rounded-t transition-all" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                                    <span className="text-xs text-gray-400">{d._id?.slice(5)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Viewed Products */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Most Viewed Products</h2>
                    </div>
                    {topProducts.length === 0 ? (
                        <EmptyState icon={Package} title="No view data" description="Product views will appear once customers start browsing." />
                    ) : (
                        <ol className="space-y-3">
                            {topProducts.map((p, i) => (
                                <li key={p._id} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-200 w-6 text-center">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.productDetails?.name ?? 'Unknown Product'}</p>
                                        <p className="text-xs text-gray-400">{p.productDetails?.productCode}</p>
                                    </div>
                                    <Badge variant="default" className="flex-shrink-0">{p.views} views</Badge>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Most Enquired Products */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Most Enquired (WhatsApp)</h2>
                    </div>
                    {mostEnquired.length === 0 ? (
                        <EmptyState icon={MessageSquare} title="No enquiry data" description="WhatsApp enquiries will appear once customers start enquiring." />
                    ) : (
                        <ol className="space-y-3">
                            {mostEnquired.map((p, i) => (
                                <li key={p._id} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-200 w-6 text-center">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.productDetails?.name ?? 'Unknown Product'}</p>
                                        <p className="text-xs text-gray-400">{p.productDetails?.productCode}</p>
                                    </div>
                                    <Badge variant="black" className="flex-shrink-0">{p.enquiries} enquiries</Badge>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>

            {/* Size & Color Breakdown */}
            {sizeColorData && (sizeColorData.sizeBreakdown?.length > 0 || sizeColorData.colorBreakdown?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sizeColorData.sizeBreakdown?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Ruler className="h-4 w-4 text-gray-500" />
                                <h2 className="text-sm font-semibold text-gray-900">Requested Sizes (WhatsApp)</h2>
                            </div>
                            <div className="space-y-2">
                                {sizeColorData.sizeBreakdown.map((s) => (
                                    <div key={s._id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{s._id || '(not specified)'}</span>
                                        <Badge variant="default">{s.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {sizeColorData.colorBreakdown?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Palette className="h-4 w-4 text-gray-500" />
                                <h2 className="text-sm font-semibold text-gray-900">Requested Colors (WhatsApp)</h2>
                            </div>
                            <div className="space-y-2">
                                {sizeColorData.colorBreakdown.map((c) => (
                                    <div key={c._id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{c._id || '(not specified)'}</span>
                                        <Badge variant="default">{c.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Traffic Sources */}
            {trafficSources.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Traffic Sources</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {trafficSources.map((s) => (
                            <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700 capitalize">{s._id}</span>
                                <Badge variant="default">{s.count}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Raw Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Recent Events</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={eventTypeFilter}
                            onChange={(e) => setEventTypeFilter(e.target.value)}
                            className="w-40"
                        >
                            <option value="">All Events</option>
                            <option value="product_view">Product Views</option>
                            <option value="collection_view">Collection Views</option>
                            <option value="whatsapp_click">WhatsApp Clicks</option>
                        </Select>
                    </div>
                </div>
                {events.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No events recorded yet.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left px-4 py-2 font-medium text-gray-500">Type</th>
                                        <th className="text-left px-4 py-2 font-medium text-gray-500">Product</th>
                                        <th className="text-left px-4 py-2 font-medium text-gray-500 hidden md:table-cell">Size / Color</th>
                                        <th className="text-left px-4 py-2 font-medium text-gray-500 hidden sm:table-cell">Source</th>
                                        <th className="text-left px-4 py-2 font-medium text-gray-500 hidden lg:table-cell">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {events.map((ev) => (
                                        <tr key={ev._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                <Badge variant={
                                                    ev.eventType === 'whatsapp_click' ? 'black' :
                                                    ev.eventType === 'product_view' ? 'default' : 'warning'
                                                }>
                                                    {ev.eventType === 'whatsapp_click' ? 'WhatsApp' :
                                                     ev.eventType === 'product_view' ? 'View' : 'Collection'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {ev.productId?.name || ev.collectionId?.name || '—'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-500 hidden md:table-cell">
                                                {ev.selectedSize || ev.selectedColor
                                                    ? [ev.selectedSize, ev.selectedColor].filter(Boolean).join(' / ')
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-500 hidden sm:table-cell capitalize">
                                                {ev.source || '—'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-400 text-xs hidden lg:table-cell">
                                                {new Date(ev.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            page={eventsPagination.page}
                            pages={eventsPagination.pages}
                            total={eventsPagination.total}
                            limit={eventsPagination.limit}
                            onPageChange={fetchEvents}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default EnquiriesPage;