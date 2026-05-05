import React, { useEffect, useState } from "react";
import { technicalDetailsService } from "../services/APIProductDetails";
import { AnimeSeriesCarousel } from "../components/AnimeSeriesCarousel";
import { CardProduct } from "../components/CardProduct";
import { Spinner } from "../components/Spinner";
import { Link } from "react-router-dom";

export const Home = () => {
    const [animeSeriesData, setAnimeSeriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);

    useEffect(() => {
        const fetchProductsByAnimeSeries = async () => {
            try {
                setLoading(true);

                const seriesResponse = await technicalDetailsService.getAllAnimeSeries();

                if (!seriesResponse.success) {
                    setError("Error al cargar las series");
                    setLoading(false);
                    return;
                }

                const series = seriesResponse.data;
                const seriesData = {};
                let allProducts = [];

                for (const animeSeries of series) {
                    const productsResponse = await technicalDetailsService.searchByTechnicalDetails({
                        anime_series: animeSeries
                    });

                    if (productsResponse.success && productsResponse.data.length > 0) {
                        seriesData[animeSeries] = productsResponse.data;
                        allProducts = [...allProducts, ...productsResponse.data];
                    }
                }

                setAnimeSeriesData(seriesData);

                // Select 3 random featured products
                const shuffled = allProducts.sort(() => 0.5 - Math.random());
                setFeaturedProducts(shuffled.slice(0, 3));

                // Fetch offer products
                try {
                    const offerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/products/recently-updated`);
                    const offerData = await offerResponse.json();
                    setOfferProducts(offerData.slice(0, 4));
                } catch (e) {
                    console.error("Error fetching offer products:", e);
                    // Fallback: filter from all products
                    const onSaleProducts = allProducts.filter(p => p.on_sale);
                    setOfferProducts(onSaleProducts.slice(0, 4));
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching products by anime series:", error);
                setError("Error al cargar los productos");
                setLoading(false);
            }
        };

        fetchProductsByAnimeSeries();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 mt-5 flex justify-center items-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 mt-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-lg text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (Object.keys(animeSeriesData).length === 0) {
        return (
            <div className="container mx-auto px-4 mt-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <p className="text-[var(--text-secondary)] text-center text-xl font-body">
                    No hay productos disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Hero Section */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, #1a1025 50%, var(--bg-primary) 100%)' }}>
                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="max-w-3xl" style={{ animation: 'fadeInUp 0.8s ease-out both' }}>
                        <span className="inline-block px-4 py-1 rounded-full text-sm font-mono font-semibold mb-4" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: 'var(--accent-primary)', border: '1px solid var(--border-active)' }}>
                            COLECCIÓN EXCLUSIVA
                        </span>
                        <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                            Descubre Figuras de Colección Únicas
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)] mb-8 font-body leading-relaxed">
                            Las mejores figuras de tus animes favoritos. Calidad premium y envíos seguros.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/catalog">
                                <button className="px-8 py-3 rounded-lg font-semibold text-[var(--bg-primary)] btn-lift font-body" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                    Ver Catálogo
                                </button>
                            </Link>
                            <Link to="/newproducts">
                                <button className="px-8 py-3 rounded-lg font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-200 font-body backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    Novedades
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <div className="absolute top-10 right-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, var(--accent-secondary), transparent)' }}></div>
                    <div className="absolute bottom-10 right-32 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, var(--accent-tertiary), transparent)' }}></div>
                </div>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
                            ⭐ Productos Destacados
                        </h2>
                        <div className="h-1 flex-grow ml-6 rounded-full" style={{ background: 'linear-gradient(to right, var(--accent-primary), transparent)' }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                to={`/product/products/${product.id}`}
                                className="group relative overflow-hidden rounded-xl border border-[var(--border-subtle)] card-hover"
                                style={{ backgroundColor: 'var(--bg-card)', animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
                            >
                                <div className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                    DESTACADO
                                </div>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/300x200/1a1a25/a0a0b0?text=Sin+Imagen"}
                                        alt={product.name}
                                        className="w-full h-64 object-cover object-top transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[var(--text-primary)] font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[var(--accent-primary)] font-bold text-xl">{product.price}€</span>
                                        <span className="text-[var(--text-muted)] text-sm group-hover:text-[var(--accent-primary)] transition-colors font-body">
                                            Ver más →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Separator */}
            <div className="container mx-auto px-4 py-8">
                <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-subtle), transparent)' }}></div>
            </div>

            {/* Recent Offers Section */}
            {offerProducts.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
                            🔥 Ofertas Recientes
                        </h2>
                        <div className="h-1 flex-grow ml-6 rounded-full" style={{ background: 'linear-gradient(to right, var(--accent-secondary), transparent)' }}></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {offerProducts.map((product, index) => (
                            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardProduct products={[product]} />
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link
                            to="/offers"
                            className="px-8 py-3 rounded-lg font-semibold text-[var(--text-primary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 btn-lift font-body"
                        >
                            Ver Todas las Ofertas
                        </Link>
                    </div>
                </div>
            )}

            {/* Separator */}

            {/* Anime Series Section */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
                        🎌 Explora por Series
                    </h2>
                    <div className="h-1 flex-grow ml-6 rounded-full" style={{ background: 'linear-gradient(to right, var(--accent-secondary), transparent)' }}></div>
                </div>

                {Object.entries(animeSeriesData).map(([animeSeries, products], index) => (
                    <div
                        key={animeSeries}
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
                    >
                        <AnimeSeriesCarousel
                            animeSeries={animeSeries}
                            products={products}
                        />
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="py-16" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, #151525 100%)' }}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">
                        ¿No encuentras lo que buscas?
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto font-body">
                        Explora nuestro catálogo completo o contáctanos para solicitudes especiales
                    </p>
                    <Link to="/catalog">
                        <button className="px-8 py-4 rounded-lg font-bold text-[var(--bg-primary)] btn-lift font-body" style={{ backgroundColor: 'var(--accent-primary)' }}>
                            Ver Catálogo Completo
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};