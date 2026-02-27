import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 text-center">
            <h1 className="text-9xl font-extrabold text-slate-200 tracking-widest">404</h1>
            <div className="bg-primary px-2 text-sm rounded rotate-12 absolute text-white shadow">
                Page Not Found
            </div>
            <p className="text-slate-600 mt-8 mb-8 text-lg">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
                Return Home
            </Link>
        </div>
    );
};

export default NotFound;
