import { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

const PrivacyPage = () => {
    useEffect(() => {
        updateSEO({ title: 'Privacy Policy', description: 'OXXY privacy policy.' });
    }, []);

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            <div className="max-w-3xl mx-auto px-5 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Privacy Policy</h1>

                <div className="prose prose-sm max-w-none text-oxxy-gray/80 space-y-6">
                    <p>
                        At OXXY, we take your privacy seriously. This policy outlines how we collect,
                        use, and protect your personal information when you visit our website.
                    </p>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">Information We Collect</h2>
                    <p>
                        We collect minimal information necessary to provide our services:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Analytics data (page views, product views, collection views)</li>
                        <li>WhatsApp enquiry interactions (product selections, sizes, colors)</li>
                        <li>Basic browsing data via lightweight analytics</li>
                    </ul>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">How We Use Your Information</h2>
                    <p>
                        The information we collect is used solely for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Improving our product offerings and user experience</li>
                        <li>Understanding which products are popular</li>
                        <li>Responding to your enquiries via WhatsApp</li>
                    </ul>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">WhatsApp Redirects</h2>
                    <p>
                        When you click the WhatsApp enquiry button, you are redirected to WhatsApp to
                        communicate with us. We track that a click occurred (without storing message
                        content) to understand customer interest. Your actual WhatsApp conversations
                        are governed by WhatsApp&apos;s own privacy policy.
                    </p>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">Cookies</h2>
                    <p>
                        We use minimal cookies required for basic functionality. We do not use
                        tracking cookies for advertising purposes.
                    </p>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">Data Retention</h2>
                    <p>
                        Analytics events are automatically deleted after 90 days. We do not maintain
                        long-term customer profiles.
                    </p>

                    <h2 className="text-lg font-semibold text-oxxy-black mt-8 mb-3">Contact</h2>
                    <p>
                        For privacy-related enquiries, please contact us via WhatsApp or email at
                        hello@oxxy.in.
                    </p>

                    <p className="text-xs text-oxxy-muted mt-12">
                        Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;