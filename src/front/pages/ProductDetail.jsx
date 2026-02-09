import React, { useState, useEffect } from 'react';
import { productService } from '../services/APIProduct';
import { technicalDetailsService } from '../services/APIProductDetails';
import { useParams } from 'react-router-dom';
import '../custom styles/productDetail.css';
import { Spinner } from '../components/Spinner';

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [technicalDetails, setTechnicalDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getProductById(id);
                setProduct(product);

                // Establecer la primera imagen como seleccionada
                if (product.images && product.images.length > 0) {
                    setSelectedImage(product.images[0]);
                    setCurrentImageIndex(0);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchTechnicalDetails = async () => {
            try {
                const response = await technicalDetailsService.getTechnicalDetails(id);
                if (response && response.success && response.data) {
                    setTechnicalDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching technical details:', error);
            }
        };

        fetchProduct();
        fetchTechnicalDetails();
    }, [id]);

    const handleAddToCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex = storedCart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            storedCart[existingIndex].quantity += quantity;
        } else {
            storedCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.images && product.images.length > 0 ? product.images[0] : "",
            });
        }

        localStorage.setItem('cart', JSON.stringify(storedCart));
        window.dispatchEvent(new Event('cartChanged'));
    };

    const handlePreviousImage = () => {
        if (product.images && product.images.length > 0) {
            const newIndex = currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(product.images[newIndex]);
        }
    };

    const handleNextImage = () => {
        if (product.images && product.images.length > 0) {
            const newIndex = currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(product.images[newIndex]);
        }
    };

    const handleThumbnailClick = (img, index) => {
        setSelectedImage(img);
        setCurrentImageIndex(index);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-10 flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 md:px-10'>
            <div className="flex flex-wrap -mx-4 mt-6">
                {/* Columna izquierda - Imágenes */}
                <div className="w-full lg:w-2/3 px-4">
                    <div className='flex justify-center relative group'>
                        <div className="media-container mx-auto relative">
                            <img
                                src={selectedImage || (product.images && product.images[0]) || "https://placeholder.pics/svg/300x200"}
                                className="rounded max-w-full w-full object-contain"
                                alt={product.name || "Producto"}
                                style={{ maxHeight: '500px' }}
                            />

                            {/* Botones de navegación - Solo se muestran si hay más de 1 imagen */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    {/* Botón anterior */}
                                    <button
                                        onClick={handlePreviousImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        aria-label="Imagen anterior"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    {/* Botón siguiente */}
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        aria-label="Imagen siguiente"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>

                                    {/* Indicador de posición */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {currentImageIndex + 1} / {product.images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Miniaturas de imágenes */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex justify-center gap-2 my-3 flex-wrap">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleThumbnailClick(img, index)}
                                    className={`media-thumbnail${selectedImage === img ? ' selected' : ''}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Miniatura ${index + 1}`}
                                        className="media-thumbnail-img"
                                    />
                                    <i className="fa-solid fa-image media-thumbnail-icon"></i>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Columna derecha - Información del producto */}
                <div className="w-full lg:w-1/3 px-4 mt-6 lg:mt-0">
                    <div className="border-2 border-gray-700 bg-gray-800 rounded-md shadow-sm p-4">
                        <div className='flex flex-col'>
                            <h1 className='product-title text-white'>
                                {product.name}
                            </h1>
                            <p className='text-white text-xl mt-2'>{product.price}€</p>
                        </div>
                        <div className='flex flex-col items-center gap-4'>
                            {/* Control de cantidad */}
                            <div className="flex items-center justify-center gap-4 my-4 rounded-full border-2 border-gray-700 max-w-40 p-1 mx-auto">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-3xl font-bold text-white hover:text-gray-700 transition-colors"
                                    aria-label="Disminuir cantidad"
                                >
                                    −
                                </button>
                                <span className="text-xl font-semibold min-w-12 text-center text-white px-2">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="w-10 h-10 flex items-center justify-center text-3xl font-bold text-white hover:text-gray-700 transition-colors"
                                    aria-label="Aumentar cantidad"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de pestañas para Descripción y Detalles Técnicos */}
            <div className="mt-8 mb-6">
                {/* Pestañas */}
                <div className="border-b-2 border-gray-700">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description'
                                ? 'border-sky-600 text-sky-600'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                }`}
                        >
                            Descripción
                        </button>
                        {technicalDetails && (
                            <button
                                onClick={() => setActiveTab('technical')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'technical'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                Detalles Técnicos
                            </button>
                        )}
                    </nav>
                </div>

                {/* Contenido de las pestañas */}
                <div className="mt-6">
                    {activeTab === 'description' && (
                        <div className="border-2 border-gray-700 bg-gray-800 rounded-md p-6">
                            <h3 className="noto-sans-jp-title text-2xl text-white mb-4">Descripción</h3>
                            <p className="text-gray-300 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'technical' && technicalDetails && (
                        <div className="border-2 border-gray-700 bg-gray-800 rounded-md p-6">
                            <h3 className="noto-sans-jp-title text-2xl text-white mb-4">Especificaciones Técnicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {technicalDetails.manufacturer && (
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm mb-1">Fabricante</span>
                                        <span className="text-white font-medium">{technicalDetails.manufacturer}</span>
                                    </div>
                                )}

                                {technicalDetails.collection && (
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm mb-1">Colección</span>
                                        <span className="text-white font-medium">{technicalDetails.collection}</span>
                                    </div>
                                )}

                                {technicalDetails.anime_series && (
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm mb-1">Serie de Anime</span>
                                        <span className="text-white font-medium">{technicalDetails.anime_series}</span>
                                    </div>
                                )}

                                {technicalDetails.character && (
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm mb-1">Personaje</span>
                                        <span className="text-white font-medium">{technicalDetails.character}</span>
                                    </div>
                                )}
                            </div>

                            {/* Si no hay ningún dato técnico */}
                            {!technicalDetails.manufacturer &&
                                !technicalDetails.collection &&
                                !technicalDetails.anime_series &&
                                !technicalDetails.character && (
                                    <p className="text-gray-400 text-center py-4">
                                        No hay detalles técnicos disponibles para este producto.
                                    </p>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}