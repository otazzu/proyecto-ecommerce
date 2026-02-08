import React, { useState, useEffect } from "react";
import { productService } from "../services/APIProduct";
import { CardProduct } from "../components/CardProduct";
import { Spinner } from "../components/Spinner";
import { Link } from "react-router-dom";

export const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRandomProducts();
    }, []);

    const fetchRandomProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getActivesProducts();

            if (response && response.length > 0) {
                // Mezclar aleatoriamente y tomar 10
                const shuffled = response.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 10);
                setProducts(selected);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Error al cargar los productos");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 flex justify-center items-center min-h-screen">
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

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-pink-600 to-purple-600 rounded-full"></div>
                    <h1 className="noto-sans-jp-title text-4xl font-bold text-white">
                        ✨ Novedades
                    </h1>
                </div>
                <p className="text-gray-400 text-lg">
                    Descubre las últimas incorporaciones a nuestro catálogo
                </p>
            </div>

            {/* Grid de productos */}
            {products.length === 0 ? (
                <div className="text-center py-20">
                    <i className="fas fa-box-open text-6xl text-gray-600 mb-4"></i>
                    <h3 className="text-2xl text-white font-bold mb-2">
                        No hay productos disponibles
                    </h3>
                    <p className="text-gray-400">
                        Vuelve pronto para ver las novedades
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <CardProduct products={[product]} />
                            </div>
                        ))}
                    </div>

                    {/* Botón para recargar */}
                    <div className="text-center mt-12">
                        <Link
                            to="/catalog"
                            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Ver Todos Los Productos
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};