import React, { useState, useEffect } from "react";
import { userService } from '../services/APIUser';
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            navigate("/");
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)
        const result = await userService.LoginUser({ email, password })
        setLoading(false)
        if (result.success) {
            navigate("/")
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="container mx-auto">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center mt-3">
                <Link to="/">
                    <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Kurisu shop logo" style={{ "height": "145px", "width": "auto" }} />
                </Link>
            </div>
            <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Iniciar sesión</h2>
                    {error && <div className="bg-red-950 text-red-400 p-2.5 my-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">{error}</div>}
                    {loading ? <div className="text-center my-3"><Spinner /></div> : (
                        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 border-2 border-gray-700 bg-gray-800 rounded-md">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email</label>
                                <div className="mt-2">
                                    <input id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={event => setEmail(event.target.value)}
                                        required
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Contraseña</label>
                                <input id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                            </div>
                            <button type="submit" className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">
                                Login
                            </button>
                        </form>
                    )}


                    <div className="py-6 flex items-center">
                        <div className="flex-1 h-px bg-gray-400"></div>
                        <p className="px-3 text-gray-400 m-0">¿Eres nuevo?</p>
                        <div className="flex-1 h-px bg-gray-400"></div>
                    </div>

                    <div className="flex justify-center">
                        <Link to="/signup" className="rounded-md justify-center bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Ir al registro</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}