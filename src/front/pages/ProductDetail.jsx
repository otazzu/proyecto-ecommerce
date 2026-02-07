import React, { useState, useEffect } from 'react';
import { productService } from '../services/APIProduct';
import { useParams } from 'react-router-dom';
import '../custom styles/productDetail.css';
import { Spinner } from '../components/Spinner';

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getProductById(id);
                setProduct(product);

                // Establecer la primera imagen como seleccionada
                if (product.images && product.images.length > 0) {
                    setSelectedImage(product.images[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
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

    if (loading) {
        return (
            <div className="container mx-auto px-10 flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-10'>
            <div className="flex flex-wrap -mx-4 mt-6">
                {/* Columna izquierda - Imágenes */}
                <div className="w-full lg:w-2/3 px-4">
                    <div className='flex justify-center'>
                        <div className="media-container mx-auto">
                            <img
                                src={selectedImage || (product.images && product.images[0]) || "https://placeholder.pics/svg/300x200"}
                                className="rounded max-w-full w-full max-h-150 min-h-150 object-contain"
                                alt={product.name || "Producto"}
                            />
                        </div>
                    </div>

                    {/* Miniaturas de imágenes */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex justify-center gap-2 my-3 flex-wrap">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
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
                <div className="w-full lg:w-1/3 px-4 lg:mt-0">
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

            {/* Descripción del producto */}
            <div className='mb-3'>
                <h3 className="my-4 noto-sans-jp-title text-2xl text-white">Descripción</h3>
                <p className="text-white">{product.description}</p>
            </div>
        </div>
    );
}