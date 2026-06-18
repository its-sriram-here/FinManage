import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
    const { user } = useAuth();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-dark">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>
            {user && <Footer />}
        </div>
    );
};

export default Layout;
