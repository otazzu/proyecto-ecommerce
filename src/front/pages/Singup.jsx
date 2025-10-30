import React, { useState } from "react"
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

export const Singup = () => {
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
		<div className="container mt-5">
			<h1 className="text-center mb-4">Registro</h1>
			{error && (
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			)}
			<div className="card">
				<div className="card-body">
					{loading ?
						(<div className="text-center my-3"><Spinner /></div>) :
						(
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Email</label>
									<input
										type="email"
										className="form-control"
										id="email"
										name="email"
										onChange={handleChange}
										value={state.email}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="user_name" className="form-label">Nombre de usuario</label>
									<input
										type="text"
										className="form-control"
										id="user_name"
										name="user_name"
										value={state.user_name}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="first_name" className="form-label">Nombre</label>
									<input
										type="text"
										className="form-control"
										id="first_name"
										name="first_name"
										value={state.first_name}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="last_name" className="form-label">Apellido</label>
									<input
										type="text"
										className="form-control"
										id="last_name"
										name="last_name"
										value={state.last_name}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Contraseña</label>
									<input
										type="password"
										className="form-control"
										id="password"
										name="password"
										onChange={handleChange}
										value={state.password}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="repeatPassword" className="form-label">Repetir contraseña</label>
									<input
										type="password"
										className="form-control"
										id="repeatPassword"
										name="repeatPassword"
										value={repeatPassword}
										onChange={event => setRepeatPassword(event.target.value)}
										required
									/>
								</div>
								<button type="submit" className="btn btn-primary w-100">
									Registrarse
								</button>
							</form>
						)}
				</div>
			</div>
			<div className="d-flex justify-content-center mt-3">
				<Link to="/login" className="btn btn-success">Ir al login →</Link>
			</div>
		</div>
	);
}; 