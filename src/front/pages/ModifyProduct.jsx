import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { technicalDetailsService } from "../services/APIProductDetails";
import { Spinner } from "../components/Spinner";
import { ProductTechnicalDetail } from "../components/ProductTechnicalDetail";

const INITIAL_STATE = {
    name: "",
    description: "",
    price: "",
    images: [],
    status: true,
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
                    });
                    setImagePreviews(response.data.images || []);
                } else if (response && !response.success) {
                    setError(response.error);
                }
            } catch (error) {
                console.error("Error al obtener datos del producto:", error);
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
                console.error("Error al obtener detalles técnicos:", error);
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
            [newImages[index], newImages[index - 1]] = [
                newImages[index - 1],
                newImages[index],
            ];
            [newPreviews[index], newPreviews[index - 1]] = [
                newPreviews[index - 1],
                newPreviews[index],
            ];
        } else if (direction === "right" && index < newImages.length - 1) {
            [newImages[index], newImages[index + 1]] = [
                newImages[index + 1],
                newImages[index],
            ];
            [newPreviews[index], newPreviews[index + 1]] = [
                newPreviews[index + 1],
                newPreviews[index],
            ];
        }

        setState((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
    };

    return (
        <div className="container mx-auto">
            {!isEnabled ? (
                <div className="flex flex-col h-screen items-center justify-center">
                    <h1 className="text-6xl font-bold text-white mb-4">403</h1>
                    <p className="text-2xl text-white mb-8">Acceso no autorizado</p>
                    <Link to="/" className="text-lg text-sky-500 hover:underline">
                        Volver al inicio
                    </Link>
                </div>
            ) : (
                <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                    <div className="mt-10 mx-auto w-full max-w-4xl">
                        {success && (
                            <div className="bg-green-950 text-green-400 p-3 mb-4 rounded-md text-center">
                                {success}
                            </div>
                        )}

                        {/* Pestañas */}
                        <div className="mb-6 border-b-2 border-gray-700">
                            <nav className="flex justify-center space-x-8">
                                <button
                                    onClick={() => setActiveTab("product")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "product"
                                        ? "border-sky-600 text-sky-600"
                                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                                        }`}
                                >
                                    Editar Producto
                                </button>
                                <button
                                    onClick={() => setActiveTab("product_details")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "product_details"
                                        ? "border-sky-600 text-sky-600"
                                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                                        }`}
                                >
                                    Detalles Técnicos {hasTechnicalDetails && "✓"}
                                </button>
                            </nav>
                        </div>

                        {/* Pestaña Producto */}
                        {activeTab === "product" && (
                            <>
                                <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">
                                    Modificar Producto
                                </h2>
                                {loading ? (
                                    <div className="text-center my-3">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6 px-6 py-6 border-2 border-gray-700 bg-gray-800 rounded-md"
                                    >
                                        <div className="grid grid-cols-1">
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm/6 font-medium text-gray-100"
                                                >
                                                    Nombre del Producto
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        name="name"
                                                        onChange={handleChange}
                                                        value={state.name}
                                                        required
                                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <label
                                                    htmlFor="description"
                                                    className="block text-sm/6 font-medium text-gray-100"
                                                >
                                                    Descripción del Producto
                                                </label>
                                                <div className="mt-2">
                                                    <textarea
                                                        id="description"
                                                        rows={4}
                                                        name="description"
                                                        onChange={handleChange}
                                                        value={state.description}
                                                        required
                                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label
                                                    htmlFor="images"
                                                    className="block mb-2 text-sm/6 font-medium text-gray-100"
                                                >
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
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {state.images.length} / {MAX_IMAGES} imágenes
                                                </p>
                                            </div>

                                            {imagePreviews.length > 0 && (
                                                <div className="mb-6">
                                                    <label className="block mb-3 text-sm/6 font-medium text-gray-100">
                                                        Imágenes actuales
                                                    </label>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                        {imagePreviews.map((preview, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={preview}
                                                                    alt={`Imagen ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                                                                />

                                                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {index > 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveImage(index, "left")}
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                                            title="Mover a la izquierda"
                                                                        >
                                                                            ←
                                                                        </button>
                                                                    )}
                                                                    {index < imagePreviews.length - 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveImage(index, "right")}
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                                            title="Mover a la derecha"
                                                                        >
                                                                            →
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                                        title="Eliminar"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>

                                                                {index === 0 && (
                                                                    <span className="absolute bottom-1 left-1 bg-sky-600 text-white text-xs px-2 py-1 rounded">
                                                                        Principal
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        Usa las flechas para reordenar. La primera imagen es la
                                                        principal.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div>
                                                    <label
                                                        htmlFor="price"
                                                        className="block text-sm/6 font-medium text-gray-100"
                                                    >
                                                        Precio
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="price"
                                                            type="number"
                                                            name="price"
                                                            step="0.01"
                                                            min="0"
                                                            onChange={handleChange}
                                                            value={state.price}
                                                            required
                                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-end">
                                                    <div className="flex items-center mb-2">
                                                        <label
                                                            htmlFor="status"
                                                            className="block text-sm/6 font-medium text-gray-100 mr-2"
                                                        >
                                                            Estado del producto:
                                                        </label>
                                                        <input
                                                            id="status"
                                                            className="form-check-input h-4 w-4"
                                                            type="checkbox"
                                                            name="status"
                                                            checked={state.status}
                                                            onChange={(e) =>
                                                                setState({ ...state, status: e.target.checked })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Actualizar Producto
                                            </button>
                                        </div>
                                        <div>
                                            <Link
                                                to={"/selectproducttomodify"}
                                                className="flex w-full justify-center bg-pink-600 rounded-md px-3 py-1.5 text-m/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                            >
                                                Cancelar
                                            </Link>
                                        </div>
                                    </form>
                                )}

                                {error && (
                                    <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">
                                        {error}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pestaña Detalles Técnicos */}
                        {activeTab === "product_details" && (
                            <>
                                <ProductTechnicalDetail
                                    productId={id}
                                    initialData={technicalDetails}
                                    showButtons={true}
                                />
                                {loading ? (
                                    <div className="text-center my-3">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="mt-6 space-y-3">
                                        <button
                                            onClick={() => {
                                                const form = document.querySelector(
                                                    'input[name="manufacturer"]'
                                                )?.form;
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
                                            className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
                                        >
                                            {hasTechnicalDetails ? "Actualizar" : "Guardar"} Detalles Técnicos
                                        </button>

                                        <Link
                                            to={"/selectproducttomodify"}
                                            className="flex w-full justify-center bg-gray-600 rounded-md px-3 py-1.5 text-m/6 font-semibold text-white hover:bg-gray-500"
                                        >
                                            Volver
                                        </Link>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md text-center">
                                        {error}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};