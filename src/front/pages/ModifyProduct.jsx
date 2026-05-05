import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { technicalDetailsService } from "../services/APIProductDetails";
import { Spinner } from "../components/Spinner";
import { ProductTechnicalDetail } from "../components/ProductTechnicalDetail";
import { useToast } from "../hooks/useToast";

const INITIAL_STATE = {
    name: "",
    description: "",
    price: "",
    images: [],
    status: true,
    on_sale: false,
    original_price: null,
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ModifyProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState(INITIAL_STATE);
    const [technicalDetails, setTechnicalDetails] = useState(null);
    const [hasTechnicalDetails, setHasTechnicalDetails] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [activeTab, setActiveTab] = useState("product");
    const toast = useToast();

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            navigate("/login");
        } else if (JSON.parse(user).rol.type !== "seller") {
            setIsEnabled(false);
            setError("Acceso no autorizado");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await productService.getCurrentProduct(id);
                if (response && response.success && response.data) {
                    setState({
                        name: response.data.name || "",
                        description: response.data.description || "",
                        price: response.data.price || "",
                        images: response.data.images || [],
                        status: response.data.status ?? true,
                        on_sale: response.data.on_sale ?? false,
                        original_price: response.data.original_price || null,
                    });
                    setImagePreviews(response.data.images || []);
                } else if (response && !response.success) {
                    setError(response.error);
                }
            } catch (error) {
                setError("Error al cargar los datos del producto");
            }
        };

        const fetchTechnicalDetails = async () => {
            try {
                const response = await technicalDetailsService.getTechnicalDetails(id);
                if (response && response.success && response.data) {
                    setTechnicalDetails(response.data);
                    setHasTechnicalDetails(true);
                } else {
                    setHasTechnicalDetails(false);
                    setTechnicalDetails(null);
                }
            } catch (error) {
                setHasTechnicalDetails(false);
            }
        };

        fetchProductData();
        fetchTechnicalDetails();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (state.images.length === 0) {
            setError("Debes tener al menos una imagen");
            return;
        }

        setLoading(true);

        try {
            const result = await productService.updateProduct(id, state);
            if (result.success) {
                setSuccess("Producto actualizado exitosamente");
                toast.showSuccess("Producto actualizado");
                setTimeout(() => {
                    navigate(`/product/products/${id}`);
                }, 2000);
            } else {
                setError(result.error || "Error al actualizar el producto");
                setLoading(false);
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
            setLoading(false);
        }
    };

    const handleSaveTechnicalDetails = async (details) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let result;
            if (hasTechnicalDetails) {
                result = await technicalDetailsService.updateTechnicalDetails(id, details);
            } else {
                result = await technicalDetailsService.createTechnicalDetails(id, details);
            }

            if (result.success) {
                setSuccess("Detalles técnicos guardados exitosamente");
                toast.showSuccess("Detalles técnicos guardados");
                setHasTechnicalDetails(true);
                setTechnicalDetails(result.data.technical_details);
                setTimeout(() => {
                    navigate(`/product/products/${id}`);
                }, 2000);
            } else {
                setError(result.error || "Error al guardar detalles técnicos");
            }
            setLoading(false);
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setState({ ...state, [inputName]: inputValue });
        setError("");
    };

    const handleImagesChange = (event) => {
        const files = Array.from(event.target.files);

        if (files.length + state.images.length > MAX_IMAGES) {
            setError(`Máximo ${MAX_IMAGES} imágenes permitidas`);
            event.target.value = "";
            return;
        }

        const validFiles = [];
        const newPreviews = [];

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                setError(`La imagen "${file.name}" excede el límite de 10 MB`);
                event.target.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                validFiles.push(reader.result);
                newPreviews.push(reader.result);

                if (validFiles.length === files.length) {
                    setState((prev) => ({
                        ...prev,
                        images: [...prev.images, ...validFiles],
                    }));
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
                    setError("");
                }
            };
            reader.onerror = () => {
                setError("Error al cargar una imagen");
            };
            reader.readAsDataURL(file);
        }

        event.target.value = "";
    };

    const removeImage = (index) => {
        setState((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const moveImage = (index, direction) => {
        const newImages = [...state.images];
        const newPreviews = [...imagePreviews];

        if (direction === "left" && index > 0) {
            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
            [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];
        } else if (direction === "right" && index < newImages.length - 1) {
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
            [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
        }

        setState((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
    };

    if (!isEnabled) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <h1 className="font-display text-6xl font-bold text-[var(--text-primary)] mb-4">403</h1>
                <p className="text-[var(--text-secondary)] text-xl mb-8 font-body">Acceso no autorizado</p>
                <Link to="/" className="text-[var(--accent-primary)] hover:underline font-body">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {success && (
                    <div className="bg-green-950/50 border border-green-500/30 text-green-400 p-3 mb-4 rounded-lg text-center font-body">
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <nav className="flex justify-center space-x-8">
                        <button
                            onClick={() => setActiveTab("product")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "product"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            Editar Producto
                        </button>
                        <button
                            onClick={() => setActiveTab("product_details")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "product_details"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            Detalles Técnicos {hasTechnicalDetails && "✓"}
                        </button>
                    </nav>
                </div>

                {/* Product Tab */}
                {activeTab === "product" && (
                    <>
                        <h2 className="font-display mb-5 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                            Modificar Producto
                        </h2>
                        {loading ? (
                            <div className="text-center my-3"><Spinner /></div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 px-6 py-6 rounded-xl border border-[var(--border-subtle)]"
                                style={{ backgroundColor: 'var(--bg-card)' }}
                            >
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] font-body mb-1">
                                            Nombre del Producto
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            onChange={handleChange}
                                            value={state.name}
                                            required
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] font-body mb-1">
                                            Descripción del Producto
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            name="description"
                                            onChange={handleChange}
                                            value={state.description}
                                            required
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="images" className="block mb-2 text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Imágenes del producto (máximo {MAX_IMAGES})
                                        </label>
                                        <input
                                            id="images"
                                            name="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImagesChange}
                                            disabled={state.images.length >= MAX_IMAGES}
                                            className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-elevated)] file:text-[var(--accent-primary)] hover:file:bg-[var(--accent-primary)] hover:file:text-[var(--bg-primary)] cursor-pointer disabled:opacity-50 file:transition-colors"
                                        />
                                        <p className="mt-1 text-xs text-[var(--text-muted)] font-body">
                                            {state.images.length} / {MAX_IMAGES} imágenes
                                        </p>
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="mb-4">
                                            <label className="block mb-3 text-sm font-medium text-[var(--text-secondary)] font-body">
                                                Imágenes actuales
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                                        <img
                                                            src={preview}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveImage(index, "left")}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white text-xs"
                                                                    style={{ backgroundColor: 'var(--accent-tertiary)' }}
                                                                    title="Mover a la izquierda"
                                                                >
                                                                    ←
                                                                </button>
                                                            )}
                                                            {index < imagePreviews.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveImage(index, "right")}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white text-xs"
                                                                    style={{ backgroundColor: 'var(--accent-tertiary)' }}
                                                                    title="Mover a la derecha"
                                                                >
                                                                    →
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white"
                                                                title="Eliminar"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        {index === 0 && (
                                                            <span className="absolute bottom-1 left-1 text-white text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                                                Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-2 text-xs text-[var(--text-muted)] font-body">
                                                Usa las flechas para reordenar. La primera imagen es la principal.
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-[var(--text-secondary)] font-body mb-1">
                                                Precio
                                            </label>
                                            <input
                                                id="price"
                                                type="number"
                                                name="price"
                                                step="0.01"
                                                min="0"
                                                onChange={handleChange}
                                                value={state.price}
                                                required
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-mono"
                                                style={{ backgroundColor: 'var(--bg-elevated)' }}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="flex items-center mb-2">
                                                <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] font-body mr-2">
                                                    Estado del producto:
                                                </label>
                                                <input
                                                    id="status"
                                                    className="form-check-input h-4 w-4 accent-[var(--accent-primary)]"
                                                    type="checkbox"
                                                    name="status"
                                                    checked={state.status}
                                                    onChange={(e) => setState({ ...state, status: e.target.checked })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* On Sale checkbox */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <input
                                            type="checkbox"
                                            id="on_sale"
                                            checked={state.on_sale || false}
                                            onChange={(e) => setState({ ...state, on_sale: e.target.checked, original_price: e.target.checked ? state.original_price : null })}
                                            className="w-4 h-4 accent-[var(--accent-secondary)] rounded"
                                        />
                                        <label htmlFor="on_sale" className="text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Producto en oferta
                                        </label>
                                    </div>

                                    {/* Warning when product is already on sale */}
                                    {state.on_sale && (
                                        <div className="mb-4 p-3 rounded-lg border text-sm font-body" style={{ backgroundColor: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.3)', color: 'var(--accent-secondary)' }}>
                                            <i className="fas fa-exclamation-triangle mr-2"></i>
                                            Este producto está en oferta. Si cambias el precio, se actualizará la fecha de oferta y aparecerá en Novedades.
                                        </div>
                                    )}

                                    {/* Original price (only visible when on_sale is true) */}
                                    {state.on_sale && (
                                        <div className="mb-4">
                                            <label htmlFor="original_price" className="block text-sm font-medium text-[var(--text-secondary)] font-body mb-1">
                                                Precio original (antes de la oferta)
                                            </label>
                                            <input
                                                type="number"
                                                id="original_price"
                                                step="0.01"
                                                min="0"
                                                value={state.original_price || ''}
                                                onChange={(e) => setState({ ...state, original_price: parseFloat(e.target.value) || null })}
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)] font-mono"
                                                style={{ backgroundColor: 'var(--bg-elevated)' }}
                                                placeholder="Ej: 29.99"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-lg py-2.5 text-base font-semibold text-[var(--bg-primary)] btn-lift font-body disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: 'var(--accent-primary)' }}
                                    >
                                        Actualizar Producto
                                    </button>
                                    <Link
                                        to={"/selectproducttomodify"}
                                        className="w-full text-center rounded-lg py-2.5 font-semibold text-[var(--accent-secondary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                                    >
                                        Cancelar
                                    </Link>
                                </div>
                            </form>
                        )}

                        {error && (
                            <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 mt-4 rounded-lg text-center font-body">
                                {error}
                            </div>
                        )}
                    </>
                )}

                {/* Technical Details Tab */}
                {activeTab === "product_details" && (
                    <>
                        <ProductTechnicalDetail
                            productId={id}
                            initialData={technicalDetails}
                            showButtons={true}
                        />
                        {loading ? (
                            <div className="text-center my-3"><Spinner /></div>
                        ) : (
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => {
                                        const form = document.querySelector('input[name="manufacturer"]')?.form;
                                        if (form) {
                                            const formData = new FormData(form);
                                            handleSaveTechnicalDetails({
                                                manufacturer: formData.get("manufacturer") || "",
                                                collection: formData.get("collection") || "",
                                                anime_series: formData.get("anime_series") || "",
                                                character: formData.get("character") || "",
                                            });
                                        }
                                    }}
                                    className="w-full rounded-lg py-2.5 font-semibold text-[var(--bg-primary)] btn-lift font-body"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}
                                >
                                    {hasTechnicalDetails ? "Actualizar" : "Guardar"} Detalles Técnicos
                                </button>

                                <Link
                                    to={"/selectproducttomodify"}
                                    className="block w-full text-center rounded-lg py-2.5 font-semibold text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all font-body"
                                    style={{ backgroundColor: 'var(--bg-card)' }}
                                >
                                    Volver
                                </Link>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 mt-4 rounded-lg text-center font-body">
                                {error}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};