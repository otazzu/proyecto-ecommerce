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

    return (
        <div className="mb-12">
            {/* Título de la serie con decoración */}
            <div className="flex items-center mb-6 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-sky-600 to-pink-600 rounded-full"></div>
                    <h2 className="noto-sans-jp-title text-2xl md:text-3xl font-bold text-white">
                        {animeSeries}
                    </h2>
                </div>
                <div className="ml-4 text-gray-400 text-sm">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'}
                </div>
            </div>

            {/* Contenedor del carrusel */}
            <div className="relative group">
                {/* Gradiente izquierdo */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

                {/* Gradiente derecho */}
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

                {/* Botón izquierdo */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                    aria-label="Scroll izquierda"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {/* Contenedor de productos con scroll */}
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

                {/* Botón derecho */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                    aria-label="Scroll derecha"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};