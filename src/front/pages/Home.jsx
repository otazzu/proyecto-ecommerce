import React, { useEffect, useState } from "react";
import { CardProduct } from "../components/CardProduct";
import { productService } from "../services/APIProduct";

export const Home = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await productService.getActivesProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <div className="container mx-auto px-4 mt-5">
                <CardProduct
                    products={products}
                />
            </div>
        </div>
    )
}