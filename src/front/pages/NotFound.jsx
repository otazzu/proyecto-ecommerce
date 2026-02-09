import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <p className="text-2xl text-white mb-8">Página no encontrada</p>
            <Link to="/" className="text-lg text-sky-500 hover:underline">Volver al inicio</Link>
        </div>
    );
}