import React, { useState, useEffect, useMemo } from "react";
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

    // Estados para los filtros disponibles
    const [availableFilters, setAvailableFilters] = useState({
        series: [],
        characters: [],
        manufacturers: [],
        collections: []
    });

    // Estados para los filtros seleccionados
    const [selectedFilters, setSelectedFilters] = useState({
        series: [],
        characters: [],
        manufacturers: [],
        collections: []
    });

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getActivesProducts();

            if (response) {
                setAllProducts(response);

                // Obtener detalles técnicos de todos los productos en paralelo
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
            // Hacer todas las peticiones en paralelo
            const detailsPromises = products.map(async (product) => {
                try {
                    const response = await technicalDetailsService.getTechnicalDetails(product.id);
                    return {
                        productId: product.id,
                        details: response && response.success ? response.data : null
                    };
                } catch (error) {
                    return {
                        productId: product.id,
                        details: null
                    };
                }
            });

            const allDetails = await Promise.all(detailsPromises);

            // Crear un mapa de detalles por producto
            const detailsMap = {};
            allDetails.forEach(item => {
                detailsMap[item.productId] = item.details;
            });

            // Combinar productos con sus detalles
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

    // Usar useMemo para filtrar productos sin hacer nuevas llamadas a la API
    const filteredProducts = useMemo(() => {
        const hasActiveFilters =
            selectedFilters.series.length > 0 ||
            selectedFilters.characters.length > 0 ||
            selectedFilters.manufacturers.length > 0 ||
            selectedFilters.collections.length > 0;

        if (!hasActiveFilters) {
            return allProducts;
        }

        return productsWithDetails.filter(product => {
            const details = product.technicalDetails;

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
    }, [selectedFilters, allProducts, productsWithDetails]);

    const handleFilterChange = (filterType, value) => {
        setFilteringLoading(true);

        setSelectedFilters(prev => {
            const currentFilters = prev[filterType];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];

            return {
                ...prev,
                [filterType]: newFilters
            };
        });

        // Simular un pequeño delay para mostrar el loading
        setTimeout(() => {
            setFilteringLoading(false);
        }, 300);
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            series: [],
            characters: [],
            manufacturers: [],
            collections: []
        });
    };

    const getActiveFiltersCount = () => {
        return (
            selectedFilters.series.length +
            selectedFilters.characters.length +
            selectedFilters.manufacturers.length +
            selectedFilters.collections.length
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 flex flex-col justify-center items-center min-h-screen">
                <Spinner />
                <p className="text-gray-400 mt-4">Cargando catálogo...</p>
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
                <h1 className="noto-sans-jp-title text-4xl font-bold text-white mb-2">
                    Catálogo Completo
                </h1>
                <p className="text-gray-400">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar de Filtros */}
                <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="sticky top-4">
                        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
                            {/* Header de filtros */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <i className="fas fa-filter"></i>
                                    Filtros
                                </h2>
                                {getActiveFiltersCount() > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                                    >
                                        Limpiar ({getActiveFiltersCount()})
                                    </button>
                                )}
                            </div>

                            {/* Filtro por Series */}
                            {availableFilters.series.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <i className="fas fa-tv text-sky-400"></i>
                                        Series de Anime
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {availableFilters.series.map(series => (
                                            <label key={series} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.series.includes(series)}
                                                    onChange={() => handleFilterChange('series', series)}
                                                    className="w-4 h-4 rounded border-gray-600 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-800"
                                                />
                                                <span className="text-sm group-hover:text-sky-400 transition-colors">
                                                    {series}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filtro por Personajes */}
                            {availableFilters.characters.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <i className="fas fa-user text-pink-400"></i>
                                        Personajes
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {availableFilters.characters.map(character => (
                                            <label key={character} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.characters.includes(character)}
                                                    onChange={() => handleFilterChange('characters', character)}
                                                    className="w-4 h-4 rounded border-gray-600 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-800"
                                                />
                                                <span className="text-sm group-hover:text-sky-400 transition-colors">
                                                    {character}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filtro por Fabricantes */}
                            {availableFilters.manufacturers.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <i className="fas fa-industry text-purple-400"></i>
                                        Fabricantes
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {availableFilters.manufacturers.map(manufacturer => (
                                            <label key={manufacturer} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.manufacturers.includes(manufacturer)}
                                                    onChange={() => handleFilterChange('manufacturers', manufacturer)}
                                                    className="w-4 h-4 rounded border-gray-600 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-800"
                                                />
                                                <span className="text-sm group-hover:text-sky-400 transition-colors">
                                                    {manufacturer}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filtro por Colecciones */}
                            {availableFilters.collections.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <i className="fas fa-box text-yellow-400"></i>
                                        Colecciones
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {availableFilters.collections.map(collection => (
                                            <label key={collection} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.collections.includes(collection)}
                                                    onChange={() => handleFilterChange('collections', collection)}
                                                    className="w-4 h-4 rounded border-gray-600 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-800"
                                                />
                                                <span className="text-sm group-hover:text-sky-400 transition-colors">
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

                {/* Grid de Productos */}
                <div className="flex-1">
                    {/* Botón toggle filtros mobile */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden mb-4 w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-sky-600 transition-colors"
                    >
                        <i className="fas fa-filter"></i>
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-sky-600 text-white text-xs px-2 py-1 rounded-full">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>

                    {/* Loading al filtrar */}
                    {filteringLoading && (
                        <div className="flex justify-center items-center py-8">
                            <Spinner />
                            <span className="ml-3 text-gray-400">Aplicando filtros...</span>
                        </div>
                    )}

                    {!filteringLoading && filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <i className="fas fa-search text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-2xl text-white font-bold mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Intenta ajustar los filtros o limpiarlos para ver más resultados
                            </p>
                            {getActiveFiltersCount() > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                    ) : !filteringLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
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