import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-dark">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
