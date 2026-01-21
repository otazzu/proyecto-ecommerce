import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { Spinner } from "../components/Spinner";

const INITIAL_STATE = {
    name: '',
    description: '',
    price: '',
    img: null,
    video: null,
    url: null,
    rate: null,
    status: true
};

export const CreateProduct = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(INITIAL_STATE)
    const [error, setError] = useState('')
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
        else if (JSON.parse(user).rol.type !== "seller") {
            setIsEnabled(false);
            setError("Acceso no autorizado");
        }
    }, [navigate])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpiar errores previos
        setLoading(true);

        try {
            const result = await productService.createProduct(state);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Error al crear el producto');
                setLoading(false);
            }
        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.');
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const inputName = event.target.name
        const inputValue = event.target.value
        setState({ ...state, [inputName]: inputValue })
        setError('')
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]

        if (file && file.size > MAX_FILE_SIZE) {
            setError(`El tamaño de la imagen excede el límite de 10 MB.`);
            event.target.value = ''; // Limpiar el input
            return;
        }

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setState(prev => ({ ...prev, img: reader.result }))
                setError(''); // Limpiar error si todo va bien
            }
            reader.onerror = () => {
                setError('Error al cargar la imagen');
            }
            reader.readAsDataURL(file)
        }
    }

    const handleVideoChange = (event) => {
        const file = event.target.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            setError(`El video no puede superar los 10 MB`);
            event.target.value = ''; // Limpiar el input
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState(prev => ({ ...prev, video: reader.result }));
                setError(''); // Limpiar error si todo va bien
            };
            reader.onerror = () => {
                setError('Error al cargar el video');
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto">
            {!isEnabled ?
                (
                    <>
                        <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center mb-6">{error}</div>
                        <Link to={"/"} className="flex rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Volver al inicio</Link>
                    </>
                ) :
                (
                    <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                        <div className="mt-10 mx-auto w-full max-w-4xl">
                            <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Crear Producto</h2>
                            {loading ?
                                (<div className="text-center my-3"><Spinner /></div>) :

                                (<form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 border-2 border-gray-700 bg-gray-800 rounded-md">
                                    <div className="grid grid-cols-1">
                                        <div className="mb-6">
                                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-100">Nombre del Producto</label>
                                            <div className="mt-2">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    onChange={handleChange}
                                                    value={state.name}
                                                    required
                                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-100">Descripción del Producto</label>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label htmlFor="img" className="block mb-2 text-sm/6 font-medium text-gray-100">
                                                    Seleccionar imagen del producto
                                                </label>
                                                <input
                                                    id="img"
                                                    name="img"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="video" className="block mb-2 text-sm/6 font-medium text-gray-100">
                                                    Seleccionar video del producto
                                                </label>
                                                <input
                                                    id="video"
                                                    name="video"
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-100">Precio</label>
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
                                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                <div className="flex items-center mb-2">
                                                    <label htmlFor="status" className="block text-sm/6 font-medium text-gray-100 mr-2">Estado del producto:</label>
                                                    <input
                                                        id="status"
                                                        className="form-check-input h-4 w-4"
                                                        type="checkbox"
                                                        name="status"
                                                        checked={state.status}
                                                        onChange={(e) => setState({ ...state, status: e.target.checked })}
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
                                            Crear
                                        </button>
                                    </div>
                                    <div>
                                        <Link
                                            to={"/"}
                                            className="flex w-full justify-center bg-pink-600 rounded-md px-3 py-1.5 text-m/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                        >
                                            Cancelar
                                        </Link>
                                    </div>
                                </form>)}

                            {error && (
                                <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>)}
        </div>
    )
}