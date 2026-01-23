import React, { useState, useEffect } from 'react';
import { productService } from '../services/APIProduct';
import { useParams } from 'react-router-dom';
import '../custom styles/productDetail.css';

export const ProductDetail = () => {

    const { id } = useParams();
    const [product, setProduct] = useState([])
    const [selectedMedia, setSelectedMedia] = useState([])
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {

            const product = await productService.getProductById(id);

            setProduct(product);

            if (product.img)
                setSelectedMedia({ type: "image", url: product.img });

            else if (product.video)
                setSelectedMedia({ type: "video", url: product.video });
        };
        setLoading(false);

        fetchProduct();
    }, [id]);

    const renderMainMedia = () => {
        if (!selectedMedia) return product.img;

        return selectedMedia.type === "image" ? (
            <img
                src={selectedMedia.url}
                className="rounded max-w-full w-full object-contain"
                alt="Vista principal"
            />
        ) : (
            <video
                controls
                className="rounded w-full max-w-200 h-100 object-contain"
            >
                <source src={selectedMedia.url} type="video/mp4" />
                Tu navegador no soporta video.
            </video>
        );
    };

    const handleAddToCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex = storedCart.findIndex(item => item.id === service.id);
        if (existingIndex !== -1) {
            // Si ya existe, actualiza cantidad
            storedCart[existingIndex].quantity += quantity;
        } else {
            // Si no existe, lo agrega
            storedCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.img || "",
            });
        }

        localStorage.setItem('cart', JSON.stringify(storedCart));
        window.dispatchEvent(new Event('cartChanged'));

    };

    return (
        <div className='container mx-auto px-10'>
            <div className="flex flex-wrap -mx-4 mt-6">
                <div className="w-full lg:w-2/3 px-4">
                    <div className='flex justify-center'>
                        <div className="media-container mx-auto">
                            {renderMainMedia()}
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 my-3 flex-wrap">
                        {product.img && (
                            <div
                                onClick={() => setSelectedMedia({ type: "image", url: product.img })}
                                className={`media-thumbnail${selectedMedia?.url === product.img ? ' selected' : ''}`}
                            >
                                <img
                                    src={product.img}
                                    alt="Miniatura imagen"
                                    className="media-thumbnail-img"
                                />
                                <i
                                    className="fa-solid fa-image media-thumbnail-icon"
                                ></i>
                            </div>
                        )}
                        {product.video && (
                            <div
                                onClick={() => setSelectedMedia({ type: "video", url: product.video })}
                                className={`media-thumbnail${selectedMedia?.url === product.video ? ' selected' : ''}`}
                            >
                                <video
                                    src={product.video}
                                    muted
                                    preload="metadata"
                                    className="media-thumbnail-video"
                                />
                                <i
                                    className="fa-solid fa-video media-thumbnail-icon"
                                ></i>
                            </div>
                        )}
                    </div>
                </div>
                {/* Columna derecha */}
                <div className="w-full lg:w-1/3 px-4 lg:mt-0">
                    <div className="border-2 border-gray-700 bg-gray-800 rounded-md shadow-sm p-4">
                        <div className='flex flex-col'>
                            <h1 className='product-title text-white'>
                                {product.name}
                            </h1>
                            <p className='text-white text-xl mt-2'>${product.price}</p>
                        </div>
                        <div className='flex flex-col items-center gap-4'>
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
                            <button className="w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mb-3'>
                <h3 className="my-4 noto-sans-jp-title text-2xl text-white">Descripción</h3>
                <p className="text-white">{product.description}</p>
            </div>
        </div>
    );
}