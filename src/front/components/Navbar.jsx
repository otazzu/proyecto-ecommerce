import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {

  const getUserRole = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return user?.rol?.type ?? null;
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      return null;
    }
  };

  // Obtener user para la imagen
  const getUser = () => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUserRole(null);
    setIsOpen(false);
    window.dispatchEvent(new Event('userChanged'));
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(getUserRole());
  const [user, setUser] = useState(getUser());
  const dropdownRef = useRef(null);

  const userImg = user?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const handleStorage = () => {
      setUserRole(getUserRole());
      setUser(getUser());
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener('userChanged', handleStorage);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('userChanged', handleStorage);
    }
  }, []);

  const userOptions = useMemo(() => {
    if (!userRole) {
      return [
        { to: "/login", label: "Iniciar sesión" },
        { to: "/signup", label: "Registrarse" }
      ];
    }

    if (userRole === "client") {
      return [
        { to: "/updateuser", label: "Editar Perfil" }
      ];
    }

    if (userRole === "seller") {
      return [
        { to: "/createproduct", label: "Añadir Producto" },
        { to: "/selectproducttomodify", label: "Modificar producto" }
      ];
    }

    return [];
  }, [userRole]);

  return (
    <>
      <nav className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">

            {/* Botón hamburguesa móvil */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icono hamburguesa */}
                <svg
                  className={`size-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                {/* Icono X */}
                <svg
                  className={`size-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Link to="/">
                  <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Kurisu Shop Logo" className="h-10 w-auto" />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Ichiban Kuji</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Cajas Misteriosas</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Novedades</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Ofertas</a>
                </div>
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Dropdown del usuario */}
              <div className="relative ml-3 z-20">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    src={userImg}
                    alt=""
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  ref={dropdownRef}
                  className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition-all duration-100 ${isOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                  {userOptions.map((option) => (
                    <Link
                      key={option.to}
                      to={option.to}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-sky-600/50 focus:outline-none transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {option.label}
                    </Link>
                  ))}
                  {userRole && (
                    <Link
                      to={'/'}
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-sky-600/50 focus:outline-none transition-colors'
                      onClick={handleLogout}>
                      Cerrar sesión
                    </Link>)}
                </div>
              </div>

              {/* Carrito de compra */}
              <div className='text-white mx-3'>
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-gray-900 space-y-1 px-2 pb-3 pt-2">
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Ichiban Kuji</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Cajas Misteriosas</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Novedades</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Ofertas</a>
        </div>
      </div>
    </>
  );
}