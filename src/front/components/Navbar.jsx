import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const Navbar = () => {
  const location = useLocation();
  const { cartItemCount } = useCart();

  const getUserRole = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return user?.rol?.type ?? null;
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      return null;
    }
  };

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
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(getUserRole());
  const [user, setUser] = useState(getUser());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);

  const userImg = user?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const userName = user?.user_name || user?.first_name || '';

  useEffect(() => {
    const handleStorage = () => {
      setUserRole(getUserRole());
      setUser(getUser());
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('userChanged', handleStorage);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('userChanged', handleStorage);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

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

  const navLinks = [
    { to: "/catalog", label: "Catálogo" },
    { to: "/newproducts", label: "Novedades" },
    { to: "/offers", label: "Ofertas" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="relative border-b border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-elevated)] focus:outline-none transition-colors"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Abrir menú</span>
                <svg className={`size-6 ${isMenuOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg className={`size-6 ${isMenuOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Logo + Desktop nav */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex shrink-0 items-center group">
                <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Kurisu Shop Logo" className="h-9 w-auto transition-transform duration-200 group-hover:scale-105" />
              </Link>
              <div className="hidden sm:ml-8 sm:block">
                <div className="flex space-x-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`relative rounded-md px-4 py-2 text-sm font-medium font-body transition-all duration-200 ${
                        isActive(link.to)
                          ? 'text-[var(--accent-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      {link.label}
                      {isActive(link.to) && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-[var(--accent-primary)] rounded-full"></span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right section: Cart + User */}
            <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Cart icon */}
              <Link
                to="/cart"
                className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                aria-label="Carrito"
              >
                <i className="fas fa-cart-shopping text-lg"></i>
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-5 min-w-[20px] px-1 text-[11px] font-bold text-white rounded-full bg-[var(--accent-secondary)]">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div className="relative ml-1 z-20" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] transition-opacity hover:opacity-80"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={userImg}
                    alt=""
                    className="size-8 rounded-full object-cover ring-2 ring-[var(--border-subtle)] hover:ring-[var(--accent-primary)] transition-all"
                  />
                  {userName && (
                    <span className="hidden sm:inline text-sm text-[var(--text-secondary)] font-body max-w-[100px] truncate">
                      {userName}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 z-30 mt-2 w-52 origin-top-right rounded-xl border border-[var(--border-subtle)] py-1 shadow-xl transition-all duration-200 ${
                    isOpen
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  {userRole && (
                    <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                      <p className="text-sm font-medium text-[var(--text-primary)] font-display truncate">{userName}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>
                  )}
                  {userOptions.map((option) => (
                    <Link
                      key={option.to}
                      to={option.to}
                      className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--accent-primary)] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {option.label}
                    </Link>
                  ))}
                  {userRole && (
                    <Link
                      to='/'
                      className='block px-4 py-2.5 text-sm text-[var(--accent-secondary)] hover:bg-[var(--bg-card)] transition-colors'
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-lg px-4 py-2.5 text-base font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-[var(--accent-primary)] bg-[var(--bg-card)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <i className="fas fa-cart-shopping"></i>
            Carrito
            {cartItemCount > 0 && (
              <span className="ml-auto bg-[var(--accent-secondary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};