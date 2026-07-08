import { InstagramIcon } from '../../../utils/icons';

const SocialCTASection = ({ settings }) => {
    const url = settings?.instagramUrl || 'https://instagram.com';

    return (
        <section className="py-16 lg:py-24 px-5 bg-oxxy-black">
            <div className="max-w-3xl mx-auto text-center">
                <InstagramIcon className="h-8 w-8 text-oxxy-white mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-oxxy-white mb-4">
                    Follow Us On Instagram
                </h2>
                <p className="text-sm text-oxxy-muted mb-8 max-w-md mx-auto">
                    Stay updated with our latest collections, behind-the-scenes, and style inspiration.
                </p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-oxxy-white text-oxxy-black text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-light transition-colors"
                >
                    <InstagramIcon className="h-4 w-4" />
                    @oxxy
                </a>
            </div>
        </section>
    );
};

export default SocialCTASection;