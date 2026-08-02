const SectionHeading = ({ label, heading, align = 'center', className = '' }) => {
    return (
        <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}>
            {label && (
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-oxxy-gold mb-4">
                    {label}
                </p>
            )}
            {heading && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.08]">
                    {heading}
                </h2>
            )}
        </div>
    );
};

export default SectionHeading;