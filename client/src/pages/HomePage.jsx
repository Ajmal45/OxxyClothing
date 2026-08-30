import { useEffect, lazy, Suspense } from 'react';
import { useHomepage, usePublicSettings } from '../hooks/useStorefrontData';
import HeroSection from '../components/storefront/home/HeroSection';
import BrandStatement from '../components/storefront/home/BrandStatement';
import ScrollReveal from '../components/storefront/ui/ScrollReveal';
import { HeroSkeleton } from '../components/storefront/ui/Skeleton';
import { updateSEO } from '../utils/seo';

const NewArrivalsSection = lazy(() => import('../components/storefront/home/NewArrivalsSection'));
const BrandStorySection = lazy(() => import('../components/storefront/home/BrandStorySection'));
const CollectionShowcase = lazy(() => import('../components/storefront/home/CollectionShowcase'));
const FeaturedProductsSection = lazy(() => import('../components/storefront/home/FeaturedProductsSection'));
const CampaignSection = lazy(() => import('../components/storefront/home/CampaignSection'));
const AboutSection = lazy(() => import('../components/storefront/home/AboutSection'));
const SocialCTASection = lazy(() => import('../components/storefront/home/SocialCTASection'));
const WhatsAppCTASection = lazy(() => import('../components/storefront/home/WhatsAppCTASection'));

const SectionFallback = () => <div className="h-20" />;

const HomePage = () => {
    const { data, loading: hpLoading } = useHomepage();
    const { data: settings } = usePublicSettings();

    useEffect(() => {
        updateSEO({
            description: data?.seoDescription || "OXXY — Complete Women Store. Premium women's fashion and clothing.",
            image: data?.heroMedia?.url,
        });
    }, [data]);

    return (
        <>
            {hpLoading ? <HeroSkeleton /> : <HeroSection data={data} />}
            <ScrollReveal>
                <BrandStatement data={data} />
            </ScrollReveal>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal>
                    <NewArrivalsSection />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.1}>
                    <BrandStorySection data={data} />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.15}>
                    <CollectionShowcase />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.2}>
                    <FeaturedProductsSection />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.25}>
                    <CampaignSection data={data} />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.3}>
                    <AboutSection data={data} />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.35}>
                    <SocialCTASection settings={settings} />
                </ScrollReveal>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
                <ScrollReveal delay={0.4}>
                    <WhatsAppCTASection data={data} />
                </ScrollReveal>
            </Suspense>
        </>
    );
};

export default HomePage;
