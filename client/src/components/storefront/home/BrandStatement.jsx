const BrandStatement = ({ data }) => {
    if (!data?.brandStatement) return null;

    return (
        <section className="py-20 lg:py-32 px-5">
            <div className="max-w-5xl mx-auto">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-center text-oxxy-black/90">
                    &ldquo;{data.brandStatement}&rdquo;
                </p>
            </div>
        </section>
    );
};

export default BrandStatement;