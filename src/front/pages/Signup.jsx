import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/APIUser";
import { Spinner } from "../components/Spinner";

const INITIAL_STATE = {
	email: '',
	password: '',
	user_name: '',
	first_name: '',
	last_name: '',
	img: ''
}

export const Signup = () => {
	const navigate = useNavigate()
	const [state, setState] = useState(INITIAL_STATE)
	const [error, setError] = useState('')
	const [rolType, setRolType] = useState('client')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleChange = (event) => {
		const inputName = event.target.name
		const inputValue = event.target.value
		setState({ ...state, [inputName]: inputValue })
		setError('')
	}

	const validateForm = () => {
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

			const result = await userService.SignupUser(state, rolType)
			if (result.success) {
				setLoading(false)
				navigate('/login')
			} else {
				setLoading(false)
				setError(result.error)
			}

		} catch (error) {
			setLoading(false)
			console.error("Error en el registro:", error)
			setError('Error al registrar usuario')
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
				<div className="mt-10 mx-auto w-full max-w-4xl">
					<h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Crear cuenta</h2>
					{loading ?
						(<div className="text-center my-3"><Spinner /></div>) :
						(
							<form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 border-2 border-gray-700 bg-gray-800 rounded-md">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
										<div className="flex items-center justify-between">
											<label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Contraseña</label>
										</div>
										<div className="mt-2">
											<input id="password"
												type="password"
												name="password"
												onChange={handleChange}
												value={state.password} required
												className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6" />
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between">
											<label htmlFor="repeat_password" className="block text-sm/6 font-medium text-gray-100">Repetir Contraseña</label>
										</div>
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
									<button type="submit" className="flex w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Crear cuenta</button>
								</div>
							</form>
						)}
					{error && (
						<div className="bg-red-950 text-red-400 p-2.5 mt-4 rounded-md outline-1 -outline-offset-1 outline-white/20 text-center">
							{error}
						</div>
					)}
					<div className="py-6 flex items-center">
						<div className="flex-1 h-px bg-gray-400"></div>
						<p className="px-3 text-gray-400 m-0">Ya tengo una cuenta</p>
						<div className="flex-1 h-px bg-gray-400"></div>
					</div>
					<div className="flex justify-center">
						<Link to="/login" className="rounded-md justify-center bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Ir al login</Link>
					</div>
				</div>
			</div>
		</div>
	);
}; 