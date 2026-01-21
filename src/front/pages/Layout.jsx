import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useLocation } from 'react-router-dom';

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();
    const rutaSinNavbarFooter = ['/login', '/signup'];
    const hideNavbarFooter = rutaSinNavbarFooter.includes(location.pathname);
    return (
        <div className="min-h-screen flex flex-col">
            <ScrollToTop>
                {!hideNavbarFooter && <Navbar />}
                <Outlet />
                {!hideNavbarFooter && <Footer />}
            </ScrollToTop>
        </div>
    )
}