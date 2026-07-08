import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CampaignSection = ({ data }) => {
    if (!data?.campaignImage?.url && !data?.campaignHeading) return null;

    return (
        <section className="relative py-20 lg:py-32 px-5 overflow-hidden">
            {data?.campaignImage?.url && (
                <div className="absolute inset-0">
                    <img
                        src={data.campaignImage.url}
                        alt={data.campaignHeading || 'Campaign'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-oxxy-black/40" />
                </div>
            )}
            <div className={`relative z-10 max-w-3xl mx-auto text-center ${data?.campaignImage?.url ? 'text-oxxy-white' : ''}`}>
                {data?.campaignHeading && (
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif leading-tight mb-6">
                        {data.campaignHeading}
                    </h2>
                )}
                {data?.campaignSubtitle && (
                    <p className={`text-base md:text-lg leading-relaxed max-w-xl mx-auto ${data?.campaignImage?.url ? 'text-white/70' : 'text-oxxy-muted'}`}>
                        {data.campaignSubtitle}
                    </p>
                )}
                {data?.campaignCTA && (
                    <Link
                        to="/collections"
                        className={`inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all ${
                            data?.campaignImage?.url
                                ? 'bg-oxxy-white text-oxxy-black hover:bg-oxxy-light'
                                : 'bg-oxxy-black text-oxxy-white hover:bg-oxxy-gray'
                        }`}
                    >
                        {data.campaignCTA} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>
        </section>
    );
};

export default CampaignSection;