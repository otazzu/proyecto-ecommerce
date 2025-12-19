import React, { useState, useRef, useEffect } from 'react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
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
            {/* Resto del nav... */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Your Company" className="h-10 w-auto" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* <!-- Current: "bg-gray-950/50 text-white", Default: "text-gray-300 hover:bg-white/5 hover:text-white" --> */}
                  <a href="#" className="text-decoration-none rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50" >Dashboard</a>
                  <a href="#" className="text-decoration-none rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Team</a>
                  <a href="#" className="text-decoration-none rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Projects</a>
                  <a href="#" className="text-decoration-none rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-600/50">Calendar</a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition-all duration-100 ${isOpen
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 focus:outline-none"
                  >
                    Your profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 focus:outline-none"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 focus:outline-none"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-gray-900 space-y-1 px-2 pb-3 pt-2">
          <a href="#" className="text-decoration-none block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Dashboard</a>
          <a href="#" className="text-decoration-none block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-sky-600/50">Team</a>
        </div>
      </div>
    </>
  );
}