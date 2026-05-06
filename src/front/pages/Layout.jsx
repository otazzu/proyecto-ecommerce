import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ToastProvider } from "../components/Toast"
import { CartSidebar } from "../components/CartSidebar"
import { useState } from 'react'
import { useLocation } from 'react-router-dom';

export const Layout = () => {
    const location = useLocation();
    const [cartOpen, setCartOpen] = useState(false);
    const rutaSinNavbarFooter = ['/login', '/signup'];

    const hideNavbarFooter = rutaSinNavbarFooter.includes(location.pathname);

    return (
        <ToastProvider>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <ScrollToTop location={location}>
                    {!hideNavbarFooter && <Navbar />}
                    <Outlet />
                    {!hideNavbarFooter && <Footer />}
                </ScrollToTop>
            </div>
        </ToastProvider>
    );
};