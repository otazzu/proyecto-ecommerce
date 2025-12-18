import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useLocation } from 'react-router-dom';

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();
    const rutaSinNavbar = ['/', '/login', '/register', '/welcome'];
    const hideNavbar = rutaSinNavbar.includes(location.pathname);
    return (
        <ScrollToTop>
            {!hideNavbar && <Navbar />}
            <Outlet />
        </ScrollToTop>
    )
}