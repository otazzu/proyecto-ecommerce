import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { Spinner } from "../components/Spinner";

const INITIAL_STATE = {
    name: "",
    description: "",
    price: "",
    img: null,
};

export const ModifyProduct = () => {

    const [isEnabled, setIsEnabled] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate()
    const [productData, setProductData] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            setIsEnabled(false);
        } else if (JSON.parse(user).rol.type !== "seller") {
            setIsEnabled(false);
        }
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getCurrentProduct(id)
                console.log(response)
                if (response && response.success && response.data) {
                    setProductData({
                        name: response.data.name || '',
                        description: response.data.description || '',
                        price: response.data.price || '',
                        img: response.data.img || ''
                    })
                }
            } catch (error) {

            }

        };
        fetchProducts();
    }, [id]);

    const handleChange = (event) => {
        const inputName = event.target.name
        const inputValue = event.target.value
        setProductData({ ...productData, [inputName]: inputValue })
        setError('')
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProductData(prev => ({ ...prev, img: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await productService.updateProduct(id, productData)
            setLoading(false)
            if (result.success) {
                navigate(`/product/products/${id}`)
            } else {
                setError(result.error)
            }

        } catch (error) {
            setLoading(false)
            setError('Error al modificar usuario')
        }
    }

    return (
        <div className="cointainer mx-auto">
            {!isEnabled ? (
                <div className="flex flex-col h-screen items-center justify-center">
                    <h1 className="text-6xl font-bold text-white mb-4">403</h1>
                    <p className="text-2xl text-white mb-8">Acceso no autorizado</p>
                    <Link to="/" className="text-lg text-sky-500 hover:underline">Volver al inicio</Link>
                </div>
            ) : (
                <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                    <div className="mt-10 mx-auto w-full max-w-4xl">
                        <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Modificar producto</h2>
                    </div>
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
                                            value={productData.name} required
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
                                            value={productData.description} required
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                                value={productData.price} required
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                        </div>
                                    </div>
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
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"

                                    className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Actualizar
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
                        </form>)}
                    {error && (
                        <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}