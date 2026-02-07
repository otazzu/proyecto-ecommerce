import React, { useRef } from 'react';
import { CardProduct } from './CardProduct';

export const AnimeSeriesCarousel = ({ animeSeries, products }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            {/* Título de la serie */}
            <h2 className="noto-sans-jp-title text-3xl font-bold text-white mb-4 px-4">
                {animeSeries}
            </h2>

            {/* Contenedor del carrusel */}
            <div className="relative group">
                {/* Botón izquierdo */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
                    aria-label="Scroll izquierda"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {/* Contenedor de productos con scroll */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 px-4 py-2 scrollbar-hide scroll-smooth"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0" style={{ width: '288px' }}>
                            <CardProduct products={[product]} />
                        </div>
                    ))}
                </div>

                {/* Botón derecho */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2"
                    aria-label="Scroll derecha"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};