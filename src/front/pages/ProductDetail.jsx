import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { productService } from '../services/APIProduct';
import { technicalDetailsService } from '../services/APIProductDetails';
import { useParams } from 'react-router-dom';
import '../custom styles/productDetail.css';
import { Spinner } from '../components/Spinner';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CardProduct } from '../components/CardProduct';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [technicalDetails, setTechnicalDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [addedFeedback, setAddedFeedback] = useState(false);

    const { addToCart } = useCart();
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getProductById(id);
                setProduct(product);

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

    // Fetch related products when technical details are loaded
    useEffect(() => {
        const fetchRelated = async () => {
            if (!technicalDetails?.anime_series) {
                // No series, fetch random products
                try {
                    setRelatedLoading(true);
                    const response = await productService.getActivesProducts();
                    if (response) {
                        const shuffled = response.filter(p => p.id !== parseInt(id)).sort(() => Math.random() - 0.5);
                        setRelatedProducts(shuffled.slice(0, 6));
                    }
                } catch (e) { /* ignore */ }
                setRelatedLoading(false);
                return;
            }

            try {
                setRelatedLoading(true);
                const response = await technicalDetailsService.searchByTechnicalDetails({
                    anime_series: technicalDetails.anime_series
                });

                if (response.success && response.data) {
                    const filtered = response.data.filter(p => p.id !== parseInt(id)).slice(0, 6);
                    if (filtered.length > 0) {
                        setRelatedProducts(filtered);
                    } else {
                        // Fallback: random products
                        const allResponse = await productService.getActivesProducts();
                        if (allResponse) {
                            const shuffled = allResponse.filter(p => p.id !== parseInt(id)).sort(() => Math.random() - 0.5);
                            setRelatedProducts(shuffled.slice(0, 6));
                        }
                    }
                } else {
                    const allResponse = await productService.getActivesProducts();
                    if (allResponse) {
                        const shuffled = allResponse.filter(p => p.id !== parseInt(id)).sort(() => Math.random() - 0.5);
                        setRelatedProducts(shuffled.slice(0, 6));
                    }
                }
            } catch (e) {
                console.error('Error fetching related products:', e);
            }
            setRelatedLoading(false);
        };

        fetchRelated();
    }, [technicalDetails, id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.showSuccess(`${product.name} añadido al carrito`);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1500);
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

    // Build breadcrumbs
    const breadcrumbs = [
        { to: '/', label: 'Inicio' },
        { to: '/catalog', label: 'Catálogo' },
    ];
    if (technicalDetails?.anime_series) {
        breadcrumbs.push({ to: '/catalog', label: technicalDetails.anime_series });
    }
    breadcrumbs.push({ to: `/product/products/${id}`, label: product.name || 'Producto' });

    if (loading) {
        return (
            <div className="container mx-auto px-10 flex justify-center items-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className='container mx-auto px-4 md:px-10'>
                {/* Breadcrumbs */}
                <div className="pt-4">
                    <Breadcrumbs items={breadcrumbs} />
                </div>

                <div className="flex flex-wrap -mx-4 mt-4">
                    {/* Left Column - Images */}
                    <div className="w-full lg:w-2/3 px-4">
                        <div className='flex justify-center relative group'>
                            <div className="media-container mx-auto relative">
                                <img
                                    src={selectedImage || (product.images && product.images[0]) || "https://placehold.co/500x400/1a1a25/a0a0b0?text=Sin+Imagen"}
                                    className="rounded-xl w-full object-contain"
                                    alt={product.name || "Producto"}
                                    style={{ maxHeight: '500px' }}
                                />

                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePreviousImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                                            aria-label="Imagen anterior"
                                        >
                                            <i className="fas fa-chevron-left text-[var(--text-primary)]"></i>
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                                            aria-label="Imagen siguiente"
                                        >
                                            <i className="fas fa-chevron-right text-[var(--text-primary)]"></i>
                                        </button>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'var(--text-primary)' }}
                                        >
                                            {currentImageIndex + 1} / {product.images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex justify-center gap-2 my-3 flex-wrap">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleThumbnailClick(img, index)}
                                        className={`media-thumbnail cursor-pointer ${selectedImage === img ? 'selected' : ''}`}
                                        style={{
                                            borderColor: selectedImage === img ? 'var(--accent-primary)' : 'var(--border-subtle)'
                                        }}
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

                    {/* Right Column - Product Info */}
                    <div className="w-full lg:w-1/3 px-4 mt-6 lg:mt-0">
                        <div className="rounded-xl border border-[var(--border-subtle)] p-5" style={{ backgroundColor: 'var(--bg-card)' }}>
                            <div className='flex flex-col'>
                                <h1 className='font-display text-2xl font-bold text-[var(--text-primary)] leading-tight'>
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    {product.on_sale && product.original_price ? (
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-3xl font-bold text-[var(--accent-secondary)]">{product.price}€</span>
                                            <span className="font-mono text-xl text-[var(--text-muted)] line-through">{product.original_price}€</span>
                                            <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,107,157,0.15)', color: 'var(--accent-secondary)' }}>
                                                -{Math.round((1 - product.price / product.original_price) * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <p className='font-mono text-2xl font-bold text-[var(--accent-primary)]'>{product.price}€</p>
                                    )}
                                </div>
                                {technicalDetails && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {technicalDetails.anime_series && (
                                            <span className="text-xs px-2 py-1 rounded-full border border-[var(--accent-tertiary)]/30 text-[var(--accent-tertiary)]" style={{ backgroundColor: 'rgba(124,92,252,0.1)' }}>
                                                {technicalDetails.anime_series}
                                            </span>
                                        )}
                                        {technicalDetails.character && (
                                            <span className="text-xs px-2 py-1 rounded-full border border-[var(--accent-secondary)]/30 text-[var(--accent-secondary)]" style={{ backgroundColor: 'rgba(255,107,157,0.1)' }}>
                                                {technicalDetails.character}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col items-center gap-4 mt-6'>
                                {/* Quantity control */}
                                <div className="flex items-center justify-center gap-4 my-2 rounded-full border border-[var(--border-subtle)] px-2 py-1">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                                        aria-label="Disminuir cantidad"
                                    >
                                        −
                                    </button>
                                    <span className="font-mono text-lg font-semibold min-w-[32px] text-center text-[var(--text-primary)]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addedFeedback}
                                    className={`w-full rounded-lg justify-center px-6 py-3 text-base font-semibold transition-all duration-300 flex items-center gap-2 btn-lift ${
                                        addedFeedback
                                            ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                                            : 'text-[var(--bg-primary)]'
                                    }`}
                                    style={addedFeedback ? {} : { backgroundColor: 'var(--accent-primary)' }}
                                >
                                    <i className={`fas ${addedFeedback ? 'fa-check' : 'fa-cart-plus'}`}></i>
                                    {addedFeedback ? '¡Añadido!' : 'Añadir al carrito'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs section */}
                <div className="mt-8 mb-6">
                    <div className="border-b border-[var(--border-subtle)]">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === 'description'
                                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                }`}
                            >
                                Descripción
                            </button>
                            {technicalDetails && (
                                <button
                                    onClick={() => setActiveTab('technical')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === 'technical'
                                        ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                                >
                                    Detalles Técnicos
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'description' && (
                            <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <h3 className="font-display text-2xl text-[var(--text-primary)] mb-4">Descripción</h3>
                                <div className="text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
                            </div>
                        )}

                        {activeTab === 'technical' && technicalDetails && (
                            <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <h3 className="font-display text-2xl text-[var(--text-primary)] mb-4">Especificaciones Técnicas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {technicalDetails.manufacturer && (
                                        <div className="flex flex-col p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                            <span className="text-[var(--text-muted)] text-xs mb-1">Fabricante</span>
                                            <span className="text-[var(--text-primary)] font-medium">{technicalDetails.manufacturer}</span>
                                        </div>
                                    )}
                                    {technicalDetails.collection && (
                                        <div className="flex flex-col p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                            <span className="text-[var(--text-muted)] text-xs mb-1">Colección</span>
                                            <span className="text-[var(--text-primary)] font-medium">{technicalDetails.collection}</span>
                                        </div>
                                    )}
                                    {technicalDetails.anime_series && (
                                        <div className="flex flex-col p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                            <span className="text-[var(--text-muted)] text-xs mb-1">Serie de Anime</span>
                                            <span className="text-[var(--text-primary)] font-medium">{technicalDetails.anime_series}</span>
                                        </div>
                                    )}
                                    {technicalDetails.character && (
                                        <div className="flex flex-col p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                            <span className="text-[var(--text-muted)] text-xs mb-1">Personaje</span>
                                            <span className="text-[var(--text-primary)] font-medium">{technicalDetails.character}</span>
                                        </div>
                                    )}
                                </div>
                                {!technicalDetails.manufacturer &&
                                    !technicalDetails.collection &&
                                    !technicalDetails.anime_series &&
                                    !technicalDetails.character && (
                                        <p className="text-[var(--text-muted)] text-center py-4">
                                            No hay detalles técnicos disponibles para este producto.
                                        </p>
                                    )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-tertiary)] rounded-full"></div>
                            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                                {technicalDetails?.anime_series ? `Más de ${technicalDetails.anime_series}` : 'Productos Relacionados'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map((product, index) => (
                                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CardProduct products={[product]} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};