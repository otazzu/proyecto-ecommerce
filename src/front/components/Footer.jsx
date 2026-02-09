import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<footer className="relative bottom-0 w-full bg-gradient-to-b from-gray-900 to-black text-white mt-auto border-t border-gray-700">
			{/* Sección principal del footer */}
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Columna 1: Sobre Nosotros */}
					<div>
						<h3 className="noto-sans-jp-title text-2xl font-bold mb-4 text-sky-400">
							Kurisu Shop
						</h3>
						<p className="text-gray-400 text-sm mb-4 leading-relaxed">
							Tu tienda de confianza para figuras de colección de anime.
							Calidad premium, envíos seguros y las mejores figuras del mercado.
						</p>
						<div className="flex gap-4">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
								aria-label="Twitter"
							>
								<i className="fab fa-twitter"></i>
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
								aria-label="Instagram"
							>
								<i className="fab fa-instagram"></i>
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
								aria-label="Facebook"
							>
								<i className="fab fa-facebook-f"></i>
							</a>
							<a
								href="https://discord.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
								aria-label="Discord"
							>
								<i className="fab fa-discord"></i>
							</a>
						</div>
					</div>

					{/* Columna 2: Enlaces Rápidos */}
					<div>
						<h4 className="font-bold text-lg mb-4 text-white">Enlaces Rápidos</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-home w-4"></i>
									Inicio
								</Link>
							</li>
							<li>
								<Link
									to="/catalog"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-store w-4"></i>
									Catálogo
								</Link>
							</li>
							<li>
								<Link
									to="/newproducts"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-star w-4"></i>
									Novedades
								</Link>
							</li>
							<li>
								<Link
									to="/updateuser"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-user w-4"></i>
									Mi Perfil
								</Link>
							</li>
						</ul>
					</div>

					{/* Columna 3: Ayuda y Soporte */}
					<div>
						<h4 className="font-bold text-lg mb-4 text-white">Ayuda y Soporte</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="mailto:soporte@kurisushop.com"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
								>
									<i className="fas fa-envelope w-4"></i>
									Contacto
								</a>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-question-circle w-4"></i>
									Preguntas Frecuentes
								</Link>
							</li>
							<li>
								<Link
									to="/shipping"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-shipping-fast w-4"></i>
									Envíos y Devoluciones
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="text-gray-400 hover:text-sky-400 transition-colors text-sm flex items-center gap-2"
									onClick={scrollToTop}
								>
									<i className="fas fa-file-contract w-4"></i>
									Términos y Condiciones
								</Link>
							</li>
						</ul>
					</div>

					{/* Columna 4: Newsletter */}
					<div>
						<h4 className="font-bold text-lg mb-4 text-white">Newsletter</h4>
						<p className="text-gray-400 text-sm mb-4">
							Suscríbete para recibir las últimas novedades y ofertas exclusivas.
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const email = e.target.email.value;
								if (email) {
									alert(`¡Gracias por suscribirte con ${email}!`);
									e.target.reset();
								}
							}}
							className="space-y-2"
						>
							<input
								type="email"
								name="email"
								placeholder="tu@email.com"
								required
								className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 text-sm"
							/>
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 text-sm"
							>
								Suscribirse
							</button>
						</form>

						{/* Métodos de pago */}
						<div className="mt-6">
							<p className="text-gray-400 text-xs mb-2">Métodos de pago:</p>
							<div className="flex gap-2 flex-wrap">
								<div className="bg-gray-800 px-2 py-1 rounded text-xs">
									<i className="fab fa-cc-visa text-blue-500"></i>
								</div>
								<div className="bg-gray-800 px-2 py-1 rounded text-xs">
									<i className="fab fa-cc-mastercard text-red-500"></i>
								</div>
								<div className="bg-gray-800 px-2 py-1 rounded text-xs">
									<i className="fab fa-cc-paypal text-blue-400"></i>
								</div>
								<div className="bg-gray-800 px-2 py-1 rounded text-xs">
									<i className="fab fa-cc-stripe text-purple-500"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Separador */}
			<div className="border-t border-gray-800"></div>

			{/* Sección de copyright */}
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-gray-400 text-sm text-center md:text-left">
						© {currentYear} Kurisu Shop. Todos los derechos reservados.
					</p>

					<div className="flex items-center gap-6 text-sm">
						<Link
							to="/privacy"
							className="text-gray-400 hover:text-sky-400 transition-colors"
							onClick={scrollToTop}
						>
							Política de Privacidad
						</Link>
						<Link
							to="/cookies"
							className="text-gray-400 hover:text-sky-400 transition-colors"
							onClick={scrollToTop}
						>
							Cookies
						</Link>
					</div>

					{/* Botón scroll to top */}
					<button
						onClick={scrollToTop}
						className="bg-sky-600 hover:bg-sky-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
						aria-label="Volver arriba"
					>
						<i className="fas fa-arrow-up"></i>
					</button>
				</div>
			</div>

			{/* Badge decorativo */}
			<div className="absolute top-0 right-10 w-32 h-32 bg-sky-600/10 rounded-full filter blur-3xl"></div>
			<div className="absolute bottom-0 left-10 w-32 h-32 bg-purple-600/10 rounded-full filter blur-3xl"></div>
		</footer>
	);
};