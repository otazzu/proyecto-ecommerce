import React, { useState, useEffect } from "react";
import { CardProduct } from "../components/CardProduct";
import { Spinner } from "../components/Spinner";
import { Link } from "react-router-dom";

export const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/products/new`);
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Respuesta no válida del servidor');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching new products:", error);
                setError("Error al cargar los productos");
                setLoading(false);
            }
        };
        fetchNewProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 flex flex-col justify-center items-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Spinner />
                <p className="text-[var(--text-secondary)] mt-4 font-body">Cargando novedades...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 mt-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="bg-red-950/50 text-red-400 p-4 rounded-lg text-center border border-red-500/30">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Hero */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, #101830 50%, var(--bg-primary) 100%)' }}>
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="fas fa-sparkles text-[var(--accent-tertiary)] text-3xl"></i>
                            <span className="text-[var(--accent-tertiary)] font-mono text-sm font-semibold uppercase tracking-wider">Recién llegados</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                            Novedades
                        </h1>
                        <p className="text-[var(--text-secondary)] font-body text-lg">
                            Lo más reciente en nuestra colección. Figuras que acaban de llegar y que no quieres perderte.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--accent-tertiary), transparent)' }}></div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                            <i className="fas fa-box-open text-4xl text-[var(--text-muted)]"></i>
                        </div>
                        <h3 className="font-display text-2xl text-[var(--text-primary)] font-bold mb-2">
                            No hay novedades disponibles
                        </h3>
                        <p className="text-[var(--text-muted)]">
                            Vuelve pronto para ver las últimas figuras
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <CardProduct products={[product]} />
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                to="/catalog"
                                className="px-8 py-3 rounded-lg font-semibold text-[var(--text-primary)] border border-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)] hover:text-white transition-all duration-200 btn-lift font-body"
                            >
                                Ver Todos Los Productos
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};