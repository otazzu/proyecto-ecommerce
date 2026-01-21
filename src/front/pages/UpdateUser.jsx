import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from '../services/APIUser';
import { Spinner } from "../components/Spinner";

const INITIAL_STATE = {
    email: '',
    password: '',
    user_name: '',
    first_name: '',
    last_name: '',
    img: ''
}

export const UpdateUser = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(INITIAL_STATE)
    const [error, setError] = useState('')
    const [rolType, setRolType] = useState('client')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getCurrentUser()
                if (response && response.success && response.data) {
                    setState({
                        email: response.data.email || '',
                        password: '',
                        user_name: response.data.user_name || '',
                        first_name: response.data.first_name || '',
                        last_name: response.data.last_name || '',
                        img: response.data.img || ''
                    })
                    setRolType(response.data.role || 'client')
                } else if (response && !response.success) {
                    sessionStorage.removeItem('token')
                    sessionStorage.removeItem('user')
                    navigate('/login')
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error)
                setError('Error al cargar los datos del usuario')
            }
        }
        fetchUserData()
    }, [])

    const validateForm = () => {
        if (!state.password) return true

        const validations = {
            match: {
                test: (pass) => pass === repeatPassword,
                message: 'Las contraseñas no coinciden'
            },
            length: {
                test: (pass) => pass.length >= 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
            },
            uppercase: {
                test: (pass) => /[A-Z]/.test(pass),
                message: 'La contraseña debe contener al menos una mayúscula'
            },
            lowercase: {
                test: (pass) => /[a-z]/.test(pass),
                message: 'La contraseña debe contener al menos una minúscula'
            },
            number: {
                test: (pass) => /\d/.test(pass),
                message: 'La contraseña debe contener al menos un número'
            }
        }
        for (const validation of Object.values(validations)) {
            if (!validation.test(state.password)) {
                setError(validation.message)
                return false
            }
        }
        return true
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }
        setLoading(true)
        try {
            const result = await userService.updateUser(state, rolType)
            setLoading(false)
            if (result.success) {
                sessionStorage.setItem("user", JSON.stringify(result.data.user));
                window.dispatchEvent(new Event('userChanged'));
                navigate('/')
            } else {
                setError(result.error)
            }
        } catch (error) {
            setLoading(false)
            setError('Error al modificar usuario')
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
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setState(prev => ({ ...prev, img: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

    return (
        <div className="container mx-auto">
            <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                <div className="mt-10 mx-auto w-full max-w-4xl">
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={state.img || defaultImg}
                            className="rounded-full border-2 border-gray-700 w-30 h-30 object-cover"
                            alt="imagen de usuario"
                            style={{ "height": "120px", "width": "auto" }}
                        />
                    </div>
                    <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Modificar Perfil</h2>
                    {loading ?
                        (<div className="text-center my-3"><Spinner /></div>) :

                        (<form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 border-2 border-gray-700 bg-gray-800 rounded-md">
                            <div className="mb-6">
                                <label className="mb-2 block text-sm/6 font-medium text-gray-100">
                                    Seleccionar imagen
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="user_name" className="block text-sm/6 font-medium text-gray-100">Nombre de usuario</label>
                                    <div className="mt-2">
                                        <input
                                            id="user_name"
                                            type="text"
                                            name="user_name"
                                            onChange={handleChange}
                                            value={state.user_name} required
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-100">Nombre</label>
                                    <div className="mt-2">
                                        <input id="first_name"
                                            type="text"
                                            name="first_name"
                                            onChange={handleChange}
                                            value={state.first_name} required
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-100">Apellidos</label>
                                    <div className="mt-2">
                                        <input id="last_name"
                                            type="text"
                                            name="last_name"
                                            onChange={handleChange}
                                            value={state.last_name} required
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email</label>
                                    <div className="mt-2">
                                        <input id="email"
                                            type="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={state.email} required
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Contraseña (Opcional)</label>
                                    <div className="mt-2">
                                        <input id="password"
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={state.password}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="repeat_password" className="block text-sm/6 font-medium text-gray-100">Repetir Contraseña</label>
                                    <div className="mt-2">
                                        <input id="repeat_password"
                                            type="password"
                                            name="repeat_password"
                                            value={repeatPassword}
                                            onChange={event => setRepeatPassword(event.target.value)}
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Actualizar</button>
                            </div>
                            <div>
                                <Link to={"/"} className="flex w-full justify-center bg-pink-600 rounded-md px-3 py-1.5 text-m/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Cancelar</Link>
                            </div>
                        </form>)}

                    {error && (
                        <div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}