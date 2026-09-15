import { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { StatCard, PageHeader, ErrorState } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { analyticsService } from '../../services/apiServices';

const DashboardPage = () => {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await analyticsService.getOverview();
                setOverview(res.data.data);
            } catch {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
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
                description="WhatsApp enquiry activity"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <StatCard
                    label="WhatsApp Enquiries"
                    value={overview?.totalWhatsAppClicks ?? 0}
                    icon={MessageSquare}
                    description="Total WhatsApp enquiry clicks"
                />
                <StatCard
                    label="Enquiry Trend (7d)"
                    value={overview?.recentWhatsAppClicks ?? 0}
                    icon={TrendingUp}
                    description="WhatsApp clicks in last 7 days"
                />
            </div>
        </div>
    );
};

export default DashboardPage;