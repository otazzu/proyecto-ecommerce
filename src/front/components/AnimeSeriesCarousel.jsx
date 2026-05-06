import React, { useRef } from 'react';
import { CardProduct } from './CardProduct';

export const AnimeSeriesCarousel = ({ animeSeries, products }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 320;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    const productCount = products.length;
    const shouldUseCarousel = productCount > 4;

    const getGridClasses = () => {
        if (productCount === 1) {
            return 'grid-cols-1 justify-center';
        } else if (productCount === 2) {
            return 'grid-cols-1 sm:grid-cols-2';
        } else if (productCount === 3) {
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        } else {
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        }
    };

    const getCardWidth = () => {
        if (productCount === 1) return 'max-w-[400px] w-full';
        if (productCount === 2) return 'w-full';
        return 'w-full';
    };

    return (
        <div className="mb-12">
            {/* Series title */}
            <div className="flex items-center mb-6 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))' }}></div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                        {animeSeries}
                    </h2>
                </div>
                <div className="ml-4 text-[var(--text-muted)] text-sm font-body">
                    {productCount} {productCount === 1 ? 'producto' : 'productos'}
                </div>
            </div>

            {/* Products Grid (for 1-4 products) */}
            {!shouldUseCarousel && (
                <div className={`grid ${getGridClasses()} gap-6 px-4`}>
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`${getCardWidth()} transform transition-all duration-300 hover:z-10`}
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                            }}
                        >
                            <CardProduct products={[product]} />
                        </div>
                    ))}
                </div>
            )}

            {/* Carousel (for 5+ products) */}
            {shouldUseCarousel && (
                <div className="relative group">
                    {/* Left gradient */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }}></div>

                    {/* Right gradient */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }}></div>

                    {/* Left button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                        aria-label="Scroll izquierda"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    {/* Products scroll container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 px-4 py-4 scrollbar-hide scroll-smooth"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 transform transition-all duration-300 hover:z-10"
                                style={{
                                    width: '300px',
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <CardProduct products={[product]} />
                            </div>
                        ))}
                    </div>

                    {/* Right button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                        style={{ backgroundColor: 'var(--accent-secondary)' }}
                        aria-label="Scroll derecha"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};