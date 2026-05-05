import React, { useState, useEffect, useMemo, useCallback } from "react";
import { productService } from "../services/APIProduct";
import { technicalDetailsService } from "../services/APIProductDetails";
import { CardProduct } from "../components/CardProduct";
import { Spinner } from "../components/Spinner";

export const Catalog = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [productsWithDetails, setProductsWithDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteringLoading, setFilteringLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("relevance");

    // States for available filters
    const [availableFilters, setAvailableFilters] = useState({
        series: [],
        characters: [],
        manufacturers: [],
        collections: []
    });

    // States for selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        series: [],
        characters: [],
        manufacturers: [],
        collections: []
    });

    const [showFilters, setShowFilters] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getActivesProducts();

            if (response) {
                setAllProducts(response);
                await fetchAllTechnicalDetails(response);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Error al cargar los productos");
            setLoading(false);
        }
    };

    const fetchAllTechnicalDetails = async (products) => {
        try {
            const detailsPromises = products.map(async (product) => {
                try {
                    const response = await technicalDetailsService.getTechnicalDetails(product.id);
                    return {
                        productId: product.id,
                        details: response && response.success ? response.data : null
                    };
                } catch (error) {
                    return { productId: product.id, details: null };
                }
            });

            const allDetails = await Promise.all(detailsPromises);
            const detailsMap = {};
            allDetails.forEach(item => {
                detailsMap[item.productId] = item.details;
            });

            const combined = products.map(product => ({
                ...product,
                technicalDetails: detailsMap[product.id]
            }));

            setProductsWithDetails(combined);
            extractFiltersFromDetails(combined);
        } catch (error) {
            console.error("Error fetching technical details:", error);
        }
    };

    const extractFiltersFromDetails = (productsWithDetails) => {
        const series = new Set();
        const characters = new Set();
        const manufacturers = new Set();
        const collections = new Set();

        productsWithDetails.forEach(product => {
            const details = product.technicalDetails;
            if (details) {
                if (details.anime_series) series.add(details.anime_series);
                if (details.character) characters.add(details.character);
                if (details.manufacturer) manufacturers.add(details.manufacturer);
                if (details.collection) collections.add(details.collection);
            }
        });

        setAvailableFilters({
            series: Array.from(series).sort(),
            characters: Array.from(characters).sort(),
            manufacturers: Array.from(manufacturers).sort(),
            collections: Array.from(collections).sort()
        });
    };

    const handleFilterChange = (filterType, value) => {
        setFilteringLoading(true);
        setSelectedFilters(prev => {
            const currentFilters = prev[filterType];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];
            return { ...prev, [filterType]: newFilters };
        });
        setTimeout(() => setFilteringLoading(false), 300);
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            series: [],
            characters: [],
            manufacturers: [],
            collections: []
        });
        setSearchTerm("");
    };

    const getActiveFiltersCount = () => {
        return (
            selectedFilters.series.length +
            selectedFilters.characters.length +
            selectedFilters.manufacturers.length +
            selectedFilters.collections.length
        );
    };

    // Filtered + searched + sorted products
    const filteredProducts = useMemo(() => {
        let products = allProducts;

        // Search filter
        if (debouncedSearch.trim()) {
            const term = debouncedSearch.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        }

        // Category filters
        const hasActiveFilters =
            selectedFilters.series.length > 0 ||
            selectedFilters.characters.length > 0 ||
            selectedFilters.manufacturers.length > 0 ||
            selectedFilters.collections.length > 0;

        if (hasActiveFilters) {
            const detailMap = {};
            productsWithDetails.forEach(p => {
                detailMap[p.id] = p.technicalDetails;
            });

            products = products.filter(product => {
                const details = detailMap[product.id];
                if (!details) return false;

                const matchesSeries = selectedFilters.series.length === 0 ||
                    selectedFilters.series.includes(details.anime_series);
                const matchesCharacter = selectedFilters.characters.length === 0 ||
                    selectedFilters.characters.includes(details.character);
                const matchesManufacturer = selectedFilters.manufacturers.length === 0 ||
                    selectedFilters.manufacturers.includes(details.manufacturer);
                const matchesCollection = selectedFilters.collections.length === 0 ||
                    selectedFilters.collections.includes(details.collection);

                return matchesSeries && matchesCharacter && matchesManufacturer && matchesCollection;
            });
        }

        // Sort
        switch (sortOrder) {
            case "price-asc":
                products = [...products].sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                products = [...products].sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                products = [...products].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                products = [...products].sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return products;
    }, [allProducts, productsWithDetails, debouncedSearch, selectedFilters, sortOrder]);

    // Highlight search term in text
    const highlightText = (text, term) => {
        if (!term.trim() || !text) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="bg-[var(--accent-primary)]/30 text-[var(--text-primary)] rounded px-0.5">{part}</mark>
                : part
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 flex flex-col justify-center items-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Spinner />
                <p className="text-[var(--text-secondary)] mt-4 font-body">Cargando catálogo...</p>
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
        <div className="container mx-auto px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Catálogo Completo
                </h1>
                <p className="text-[var(--text-secondary)] font-body">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    {debouncedSearch && (
                        <span className="text-[var(--accent-primary)]"> para "{debouncedSearch}"</span>
                    )}
                </p>
            </div>

            {/* Search + Sort bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-1">
                <div className="relative flex-1">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors font-body"
                        style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <i className="fas fa-xmark"></i>
                        </button>
                    )}
                </div>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors font-body appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                >
                    <option value="relevance">Relevancia</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre A-Z</option>
                    <option value="name-desc">Nombre Z-A</option>
                </select>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter Sidebar */}
                <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="sticky top-4">
                        <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                            {/* Filter Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <i className="fas fa-filter text-[var(--accent-primary)]"></i>
                                    Filtros
                                </h2>
                                {getActiveFiltersCount() > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                                    >
                                        Limpiar ({getActiveFiltersCount()})
                                    </button>
                                )}
                            </div>

                            {/* Filter: Series */}
                            {availableFilters.series.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2 text-sm">
                                        <i className="fas fa-tv text-[var(--accent-primary)]"></i>
                                        Series de Anime
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                        {availableFilters.series.map(series => (
                                            <label key={series} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.series.includes(series)}
                                                    onChange={() => handleFilterChange('series', series)}
                                                    className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)]"
                                                />
                                                <span className="text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                                                    {series}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filter: Characters */}
                            {availableFilters.characters.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2 text-sm">
                                        <i className="fas fa-user text-[var(--accent-secondary)]"></i>
                                        Personajes
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                        {availableFilters.characters.map(character => (
                                            <label key={character} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.characters.includes(character)}
                                                    onChange={() => handleFilterChange('characters', character)}
                                                    className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)]"
                                                />
                                                <span className="text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                                                    {character}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filter: Manufacturers */}
                            {availableFilters.manufacturers.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2 text-sm">
                                        <i className="fas fa-industry text-[var(--accent-tertiary)]"></i>
                                        Fabricantes
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                        {availableFilters.manufacturers.map(manufacturer => (
                                            <label key={manufacturer} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.manufacturers.includes(manufacturer)}
                                                    onChange={() => handleFilterChange('manufacturers', manufacturer)}
                                                    className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)]"
                                                />
                                                <span className="text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                                                    {manufacturer}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filter: Collections */}
                            {availableFilters.collections.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2 text-sm">
                                        <i className="fas fa-box text-yellow-400"></i>
                                        Colecciones
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                        {availableFilters.collections.map(collection => (
                                            <label key={collection} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.collections.includes(collection)}
                                                    onChange={() => handleFilterChange('collections', collection)}
                                                    className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)]"
                                                />
                                                <span className="text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                                                    {collection}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden mb-4 w-full py-3 border border-[var(--border-subtle)] rounded-lg flex items-center justify-center gap-2 hover:border-[var(--accent-primary)] transition-colors font-body"
                        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    >
                        <i className="fas fa-filter"></i>
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs font-bold px-2 py-0.5 rounded-full">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>

                    {/* Loading overlay */}
                    {filteringLoading && (
                        <div className="flex justify-center items-center py-8">
                            <Spinner />
                            <span className="ml-3 text-[var(--text-secondary)]">Aplicando filtros...</span>
                        </div>
                    )}

                    {!filteringLoading && filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <i className="fas fa-search text-4xl text-[var(--text-muted)]"></i>
                            </div>
                            <h3 className="font-display text-2xl text-[var(--text-primary)] font-bold mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-[var(--text-muted)] mb-4">
                                Intenta ajustar los filtros o cambiar tu búsqueda
                            </p>
                            {getActiveFiltersCount() > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-2 rounded-lg font-semibold text-[var(--bg-primary)]"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}
                                >
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                    ) : !filteringLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <CardProduct products={[product]} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};