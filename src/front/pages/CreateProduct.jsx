import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { technicalDetailsService } from "../services/APIProductDetails";
import { ProductTechnicalDetail } from "../components/ProductTechnicalDetail";
import { Spinner } from "../components/Spinner";
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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const CreateProduct = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(INITIAL_STATE);
    const [technicalDetails, setTechnicalDetails] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [activeTab, setActiveTab] = useState("product");
    const [createdProductId, setCreatedProductId] = useState(null);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (state.images.length === 0) {
            setError("Debes subir al menos una imagen");
            return;
        }

        setLoading(true);

        try {
            const result = await productService.createProduct(state);
            if (result.success) {
                setCreatedProductId(result.data.product.id);
                setSuccess("Producto creado exitosamente");
                toast.showSuccess("Producto creado exitosamente");
                setActiveTab("product_details");
                setLoading(false);
            } else {
                setError(result.error || "Error al crear el producto");
                setLoading(false);
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
            setLoading(false);
        }
    };

    const handleSaveTechnicalDetails = async () => {
        if (!createdProductId) {
            setError("Primero debes crear el producto");
            return;
        }

        if (!technicalDetails || !Object.values(technicalDetails).some(val => val)) {
            navigate(`/`);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const result = await technicalDetailsService.createTechnicalDetails(
                createdProductId,
                technicalDetails
            );

            if (result.success) {
                setSuccess("Detalles técnicos guardados exitosamente");
                toast.showSuccess("Detalles técnicos guardados");
                setTimeout(() => navigate(`/product/products/${createdProductId}`), 2000);
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
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError(`El archivo "${file.name}" no es una imagen válida.`);
                event.target.value = "";
                return;
            }
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
                {/* Success message */}
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
                            disabled={createdProductId !== null}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "product"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            } ${createdProductId ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Crear producto
                        </button>
                        <button
                            onClick={() => setActiveTab("product_details")}
                            disabled={!createdProductId}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "product_details"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            } ${!createdProductId ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Detalles técnicos (opcional)
                        </button>
                    </nav>
                </div>

                {activeTab === "product" && (
                    <>
                        <h2 className="font-display mb-5 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                            Crear Producto
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
                                            disabled={createdProductId !== null}
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body disabled:opacity-50"
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
                                            disabled={createdProductId !== null}
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body disabled:opacity-50"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    {/* Images section */}
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
                                            disabled={state.images.length >= MAX_IMAGES || createdProductId !== null}
                                            className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-elevated)] file:text-[var(--accent-primary)] hover:file:bg-[var(--accent-primary)] hover:file:text-[var(--bg-primary)] cursor-pointer disabled:opacity-50 file:transition-colors file:cursor-pointer"
                                        />
                                        <p className="mt-1 text-xs text-[var(--text-muted)] font-body">
                                            {state.images.length} / {MAX_IMAGES} imágenes subidas
                                        </p>
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="mb-4">
                                            <label className="block mb-3 text-sm font-medium text-[var(--text-secondary)] font-body">
                                                Vista previa de imágenes
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                        {!createdProductId && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                        {index === 0 && (
                                                            <span className="absolute bottom-1 left-1 text-white text-xs px-2 py-0.5 rounded font-body" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                                                Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
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
                                                disabled={createdProductId !== null}
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-mono disabled:opacity-50"
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
                                                    disabled={createdProductId !== null}
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
                                            disabled={createdProductId !== null}
                                            className="w-4 h-4 accent-[var(--accent-secondary)] rounded"
                                        />
                                        <label htmlFor="on_sale" className="text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Producto en oferta
                                        </label>
                                    </div>

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
                                                disabled={createdProductId !== null}
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)] font-mono disabled:opacity-50"
                                                style={{ backgroundColor: 'var(--bg-elevated)' }}
                                                placeholder="Ej: 29.99"
                                            />
                                        </div>
                                    )}
                                </div>

                                {!createdProductId && (
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full rounded-lg py-2.5 text-base font-semibold text-[var(--bg-primary)] btn-lift font-body disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: 'var(--accent-primary)' }}
                                        >
                                            Crear
                                        </button>
                                        <Link
                                            to={"/"}
                                            className="w-full text-center rounded-lg py-2.5 font-semibold text-[var(--accent-secondary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                                        >
                                            Cancelar
                                        </Link>
                                    </div>
                                )}
                            </form>
                        )}

                        {error && (
                            <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 mt-4 rounded-lg text-center font-body">
                                {error}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "product_details" && (
                    <>
                        <ProductTechnicalDetail
                            productId={createdProductId}
                            onSave={setTechnicalDetails}
                        />
                        {loading ? (
                            <div className="text-center my-3"><Spinner /></div>
                        ) : (
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleSaveTechnicalDetails}
                                    className="w-full rounded-lg py-2.5 font-semibold text-[var(--bg-primary)] btn-light font-body"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}
                                >
                                    Guardar detalles técnicos
                                </button>
                                <Link
                                    to={`/product/products/${createdProductId}`}
                                    className="block w-full text-center rounded-lg py-2.5 font-semibold text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all font-body"
                                    style={{ backgroundColor: 'var(--bg-card)' }}
                                >
                                    Omitir y finalizar
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