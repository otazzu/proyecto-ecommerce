import React from "react";
import { Link } from "react-router-dom";

export const EditProductCard = ({ products, onStatusChange }) => {
    return (
        <div className="flex flex-col mb-5">
            {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between m-2 rounded-r-md border-2 border-gray-700 bg-gray-800 shadow-lg shadow-zinc-900/50">
                    <div className="flex items-center">
                        <img
                            src={product.img || "https://placeholder.pics/svg/300x200"}
                            className="w-30 max-h-30 min-h-30 object-cover"
                            alt={product.name}
                        />
                        <h5 className="text-lg text-white font-semibold pr-2 ml-2">
                            {product.name}
                        </h5>
                    </div>
                    <div className="text-white items-center mr-2 flex flex-col sm:flex-row gap-2">
                        <input
                            id="status"
                            className="h-4 w-4"
                            type="checkbox"
                            name="status"
                            checked={product.status}
                            onChange={() => onStatusChange(product.id, product.status)}

                        />
                        <Link
                            to={`/selectproducttomodify/${product.id}`}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}