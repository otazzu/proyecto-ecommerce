import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { productService } from "../services/APIProduct";
import { EditProductCard } from "../components/EditProductCard";

export const SelectProductToModify = () => {
    const navigate = useNavigate();
    const [isEnabled, setIsEnabled] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            setIsEnabled(false);
        } else if (JSON.parse(user).rol.type !== "seller") {
            setIsEnabled(false);
        }

    }, [navigate]);


    useEffect(() => {
        const fetchProducts = async () => {
            const data = await productService.getProducts();
            console.log(data)
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleStatusChange = async (productId, currentStatus) => {
        const newStatus = !currentStatus;

        setProducts(products.map(p =>
            p.id === productId ? { ...p, status: newStatus } : p
        ));

        const result = await productService.checkProductStatus(productId, newStatus);

        if (!result.success) {
            // Revertir si falla
            setProducts(products.map(p =>
                p.id === productId ? { ...p, status: currentStatus } : p
            ));
            setError(result.error || "Error al actualizar el estado");
        }
    };

    return (
        <div className="container mx-auto">
            {!isEnabled ? (
                <div className="flex flex-col h-screen items-center justify-center">
                    <h1 className="text-6xl font-bold text-white mb-4">403</h1>
                    <p className="text-2xl text-white mb-8">Acceso no autorizado</p>
                    <Link to="/" className="text-lg text-sky-500 hover:underline">Volver al inicio</Link>
                </div>
            ) :
                (
                    <div className="container mx-auto mt-10">
                        <h2 className="noto-sans-jp-title mb-5 text-center text-2xl/9 font-bold tracking-tight text-white">Selecciona producto a modificar</h2>
                        <EditProductCard
                            products={products}
                            onStatusChange={handleStatusChange} />
                    </div>
                )}
        </div>
    );
}