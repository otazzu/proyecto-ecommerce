import React, { useEffect, useState } from "react";
import { technicalDetailsService } from "../services/APIProductDetails";
import { AnimeSeriesCarousel } from "../components/AnimeSeriesCarousel";
import { Spinner } from "../components/Spinner";
import { Link } from "react-router-dom";

export const Home = () => {
    const [animeSeriesData, setAnimeSeriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [featuredProducts, setFeaturedProducts] = useState([]);

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

                // Seleccionar 3 productos destacados aleatoriamente
                const shuffled = allProducts.sort(() => 0.5 - Math.random());
                setFeaturedProducts(shuffled.slice(0, 3));

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
            <div className="container mx-auto px-4 mt-5 flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 mt-5">
                <div className="bg-red-950 text-red-400 p-4 rounded-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (Object.keys(animeSeriesData).length === 0) {
        return (
            <div className="container mx-auto px-4 mt-5">
                <p className="text-white text-center text-xl">
                    No hay productos disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section - Banner principal */}
            <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="noto-sans-jp-title text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                            Descubre Figuras de Colección Únicas
                        </h1>
                        <p className="text-xl text-gray-200 mb-8">
                            Las mejores figuras de tus animes favoritos. Calidad premium y envíos seguros.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/catalog">
                                <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    Ver Catálogo
                                </button>
                            </Link>
                            <Link to="/newproducts">
                                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg border-2 border-white/30 transition-all duration-200">
                                    Novedades
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Decoración de fondo */}
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-32 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>

            {/* Productos Destacados */}
            {featuredProducts.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="noto-sans-jp-title text-3xl font-bold text-white">
                            ⭐ Productos Destacados
                        </h2>
                        <div className="h-1 flex-grow ml-6 bg-gradient-to-r from-sky-600 to-transparent rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                to={`/product/products/${product.id}`}
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-sky-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-sky-600/20"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="absolute top-4 right-4 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                    DESTACADO
                                </div>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : "https://placeholder.pics/svg/300x200"}
                                        alt={product.name}
                                        className="w-full h-64 object-cover object-top transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sky-400 font-bold text-xl">{product.price}€</span>
                                        <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                                            Ver más →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Separador decorativo */}
            <div className="container mx-auto px-4 py-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Sección de series */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="noto-sans-jp-title text-3xl font-bold text-white">
                        🎌 Explora por Series
                    </h2>
                    <div className="h-1 flex-grow ml-6 bg-gradient-to-r from-pink-600 to-transparent rounded"></div>
                </div>

                {Object.entries(animeSeriesData).map(([animeSeries, products], index) => (
                    <div
                        key={animeSeries}
                        style={{
                            animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                        }}
                    >
                        <AnimeSeriesCarousel
                            animeSeries={animeSeries}
                            products={products}
                        />
                    </div>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-sky-900 to-blue-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="noto-sans-jp-title text-4xl font-bold text-white mb-4">
                        ¿No encuentras lo que buscas?
                    </h2>
                    <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
                        Explora nuestro catálogo completo o contáctanos para solicitudes especiales
                    </p>
                    <Link to="/catalog">
                        <button className="bg-white text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            Ver Catálogo Completo
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};