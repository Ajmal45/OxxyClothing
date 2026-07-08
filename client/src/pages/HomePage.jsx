import { useEffect } from 'react';
import { useHomepage, usePublicSettings } from '../hooks/useStorefrontData';
import HeroSection from '../components/storefront/home/HeroSection';
import BrandStatement from '../components/storefront/home/BrandStatement';
import NewArrivalsSection from '../components/storefront/home/NewArrivalsSection';
import BrandStorySection from '../components/storefront/home/BrandStorySection';
import CollectionShowcase from '../components/storefront/home/CollectionShowcase';
import FeaturedProductsSection from '../components/storefront/home/FeaturedProductsSection';
import CampaignSection from '../components/storefront/home/CampaignSection';
import AboutSection from '../components/storefront/home/AboutSection';
import SocialCTASection from '../components/storefront/home/SocialCTASection';
import WhatsAppCTASection from '../components/storefront/home/WhatsAppCTASection';
import ScrollReveal from '../components/storefront/ui/ScrollReveal';
import { HeroSkeleton } from '../components/storefront/ui/Skeleton';
import { updateSEO } from '../utils/seo';

const HomePage = () => {
    const { data, loading: hpLoading } = useHomepage();
    const { data: settings } = usePublicSettings();

    useEffect(() => {
        updateSEO({
            description: data?.seoDescription || 'OXXY — Complete Women Store. Premium women\'s fashion and clothing.',
            image: data?.heroMedia?.url,
        });
    }, [data]);

    if (hpLoading) return <HeroSkeleton />;

    return (
            <>
            <HeroSection data={data} />
            <ScrollReveal>
                <BrandStatement data={data} />
            </ScrollReveal>
            <ScrollReveal>
                <NewArrivalsSection />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <BrandStorySection data={data} />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
                <CollectionShowcase />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <FeaturedProductsSection />
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
                <CampaignSection data={data} />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
                <AboutSection data={data} />
            </ScrollReveal>
            <ScrollReveal delay={0.35}>
                <SocialCTASection settings={settings} />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
                <WhatsAppCTASection data={data} />
            </ScrollReveal>
            </>
    );
};

export default HomePage;