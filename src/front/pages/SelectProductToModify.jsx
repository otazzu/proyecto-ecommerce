import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { EditProductCard } from "../components/EditProductCard";
import { Spinner } from "../components/Spinner";

export const SelectProductToModify = () => {
    const navigate = useNavigate();
    const [isEnabled, setIsEnabled] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            setIsEnabled(false);
        } else if (JSON.parse(user).rol.type !== "seller") {
            setIsEnabled(false);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setFetchError("");
                const data = await productService.getProducts();
                if (!data) {
                    setFetchError("Error al obtener los productos. Intenta de nuevo.");
                } else {
                    setProducts(data);
                }
            } catch (err) {
                setFetchError("Error de conexión. Verifica tu red e intenta de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleStatusChange = async (productId, currentStatus) => {
        const newStatus = !currentStatus;

        setProducts(products.map(p =>
            p.id === productId ? { ...p, status: newStatus } : p
        ));

        const result = await productService.checkProductStatus(productId, newStatus);

        if (!result.success) {
            setProducts(products.map(p =>
                p.id === productId ? { ...p, status: currentStatus } : p
            ));
            setError(result.error || "Error al actualizar el estado");
        }
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by search query (case-insensitive match on name)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query)
            );
        }

        // Filter by status
        if (activeFilter === "active") {
            result = result.filter(p => p.status === true);
        } else if (activeFilter === "inactive") {
            result = result.filter(p => p.status === false);
        }

        // Sort
        if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "recent") {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [products, searchQuery, activeFilter, sortBy]);

    const activeCount = useMemo(() => products.filter(p => p.status === true).length, [products]);
    const inactiveCount = useMemo(() => products.filter(p => p.status === false).length, [products]);

    if (!isEnabled) {
        return (
            <div className="flex flex-col h-screen items-center justify-center animate-fade-in">
                <h1 className="font-display text-8xl font-bold text-red-500 mb-2 glitch-title">403</h1>
                <p className="text-2xl text-[var(--text-secondary)] mb-8 font-body uppercase tracking-widest">Acceso no autorizado</p>
                <Link
                    to="/"
                    className="px-6 py-3 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] font-body text-sm uppercase tracking-wider hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all duration-300"
                >
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Header - Catalog style */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Panel de Inventario
                </h1>
                <p className="text-[var(--text-secondary)] font-body">
                    <i className="fa-solid fa-grip-lines text-[var(--accent-primary)] mr-2" />
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    {searchQuery && (
                        <span className="text-[var(--accent-primary)]"> para "{searchQuery}"</span>
                    )}
                </p>
            </div>

            {/* Search + Sort Bar - Catalog style */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-1">
                <div className="relative flex-1">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar producto por nombre..."
                        aria-label="Buscar producto por nombre"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors font-body"
                        style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <i className="fas fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Sort select - Catalog style */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors font-body appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                >
                    <option value="name">Nombre A-Z</option>
                    <option value="recent">Más recientes</option>
                </select>
            </div>

            {/* Filter + Stats Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up stagger-2">
                {/* Status filter buttons - Catalog style */}
                <div className="flex items-center gap-2" role="group" aria-label="Filtrar por estado">
                    <button
                        className={`px-4 py-2 rounded-lg text-xs font-body uppercase tracking-wider border transition-all duration-200 ${
                            activeFilter === "all"
                                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)]"
                                : "text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                        }`}
                        style={activeFilter !== "all" ? { backgroundColor: 'var(--bg-card)' } : {}}
                        onClick={() => setActiveFilter("all")}
                        aria-pressed={activeFilter === "all"}
                    >
                        Todos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-xs font-body uppercase tracking-wider border transition-all duration-200 ${
                            activeFilter === "active"
                                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)]"
                                : "text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                        }`}
                        style={activeFilter !== "active" ? { backgroundColor: 'var(--bg-card)' } : {}}
                        onClick={() => setActiveFilter("active")}
                        aria-pressed={activeFilter === "active"}
                    >
                        Activos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-xs font-body uppercase tracking-wider border transition-all duration-200 ${
                            activeFilter === "inactive"
                                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)]"
                                : "text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                        }`}
                        style={activeFilter !== "inactive" ? { backgroundColor: 'var(--bg-card)' } : {}}
                        onClick={() => setActiveFilter("inactive")}
                        aria-pressed={activeFilter === "inactive"}
                    >
                        Inactivos
                    </button>
                </div>

                {/* Stats badges - Catalog pill style */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        <i className="fa-solid fa-box mr-1.5 text-[var(--accent-primary)]" />
                        {products.length} total
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                        <span className="led-indicator active mr-1.5" />
                        {activeCount} activos
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-red-400">
                        <span className="led-indicator inactive mr-1.5" />
                        {inactiveCount} inactivos
                    </span>
                </div>
            </div>

            {/* Error display - Catalog style */}
            {error && (
                <div className="mb-4 bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-lg text-center font-body">
                    <i className="fa-solid fa-triangle-exclamation mr-2" />
                    {error}
                </div>
            )}

            {fetchError && (
                <div className="mb-4 bg-red-950/50 border border-red-500/30 text-red-400 p-4 rounded-lg text-center font-body">
                    <i className="fa-solid fa-triangle-exclamation mr-2" />
                    {fetchError}
                </div>
            )}

            {/* Loading state - Spinner component */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Spinner />
                    <p className="text-[var(--text-secondary)] mt-4 font-body">Cargando inventario...</p>
                </div>
            ) : (
                /* Product Grid */
                <>
                    {filteredProducts.length === 0 && !fetchError ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <i className="fa-solid fa-box-open text-4xl text-[var(--text-muted)]"></i>
                            </div>
                            <h3 className="font-display text-2xl text-[var(--text-primary)] font-bold mb-2">
                                Sin productos
                            </h3>
                            <p className="text-[var(--text-muted)] mb-4 font-body">
                                {searchQuery ? "No se encontraron resultados para tu búsqueda" : "No hay productos disponibles en el sistema"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map((product, index) => (
                                <EditProductCard
                                    key={product.id}
                                    product={product}
                                    onStatusChange={handleStatusChange}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};