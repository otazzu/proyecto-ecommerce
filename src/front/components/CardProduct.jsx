import React from 'react'
import { Link } from "react-router-dom";

export const CardProduct = ({ products }) => {
    return (
        <>
            {products.map((product) => {
                return (
                    <div key={product.id} className="noto-sans-jp-title text-2xl/9 font-bold tracking-tight text-white rounded-lg border-2 border-gray-700 bg-gray-800 shadow-lg shadow-zinc-900/50 hover:scale-105 transition-transform duration-200 w-full">
                        <Link
                            to={`/product/products/${product.id}`}
                            className="block"
                        >
                            <img
                                src={
                                    product.images && product.images.length > 0
                                        ? product.images[0]
                                        : "https://placeholder.pics/svg/300x200"
                                }
                                className="rounded-t-lg w-full h-72 object-cover object-top"
                                alt={product.name}
                            />

                            <div className="p-4">
                                <div className="h-28 mb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <h5 className="text-lg font-semibold pr-2">
                                        {product.name}
                                    </h5>
                                </div>
                                <div className='flex justify-center'>
                                    <p className="mt-4 text-sm font-medium">{product.price}€</p>
                                </div>
                                <div className='flex justify-center mt-4'>
                                    <button
                                        className='text-sm w-full rounded-md justify-center bg-sky-700 px-3 py-1.5 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }}
                                    >Añadir al carrito</button>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </>
    )
}