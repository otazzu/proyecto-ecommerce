import React, { useEffect, useState } from "react";
import { technicalDetailsService } from "../services/APIProductDetails";
import { AnimeSeriesCarousel } from "../components/AnimeSeriesCarousel";
import { Spinner } from "../components/Spinner";

export const Home = () => {
    const [animeSeriesData, setAnimeSeriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProductsByAnimeSeries = async () => {
            try {
                setLoading(true);

                // Obtener todas las series de anime disponibles
                const seriesResponse = await technicalDetailsService.getAllAnimeSeries();

                if (!seriesResponse.success) {
                    setError("Error al cargar las series");
                    setLoading(false);
                    return;
                }

                const series = seriesResponse.data;

                // Para cada serie, obtener sus productos
                const seriesData = {};

                for (const animeSeries of series) {
                    const productsResponse = await technicalDetailsService.searchByTechnicalDetails({
                        anime_series: animeSeries
                    });

                    if (productsResponse.success && productsResponse.data.length > 0) {
                        seriesData[animeSeries] = productsResponse.data;
                    }
                }

                setAnimeSeriesData(seriesData);
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
        <div className="container mx-auto mt-5">
            {/* Renderizar un carrusel por cada serie de anime */}
            {Object.entries(animeSeriesData).map(([animeSeries, products]) => (
                <AnimeSeriesCarousel
                    key={animeSeries}
                    animeSeries={animeSeries}
                    products={products}
                />
            ))}
        </div>
    );
};