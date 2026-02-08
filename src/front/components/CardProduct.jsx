import React from 'react'
import { Link } from "react-router-dom";

export const CardProduct = ({ products }) => {
    return (
        <>
            {products.map((product) => {
                return (
                    <div
                        key={product.id}
                        className="group noto-sans-jp-title text-2xl/9 font-bold tracking-tight text-white rounded-xl border-2 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-2xl hover:shadow-sky-600/20 hover:border-sky-600 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden w-full"
                    >
                        <Link
                            to={`/product/products/${product.id}`}
                            className="block"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={
                                        product.images && product.images.length > 0
                                            ? product.images[0]
                                            : "https://placeholder.pics/svg/300x200"
                                    }
                                    className="rounded-t-xl w-full h-72 object-cover object-top transform group-hover:scale-110 transition-transform duration-500"
                                    alt={product.name}
                                />
                                {/* Overlay con gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Badge "NUEVO" si quieres añadirlo condicionalmente */}
                                {/* <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    NUEVO
                                </div> */}
                            </div>

                            <div className="p-4">
                                <div className="h-20 mb-3 overflow-hidden">
                                    <h5 className="text-base font-semibold leading-tight line-clamp-3 group-hover:text-sky-400 transition-colors duration-200">
                                        {product.name}
                                    </h5>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs">Precio</span>
                                        <p className="text-sky-400 text-xl font-bold">{product.price}€</p>
                                    </div>
                                    <div className="text-gray-400 group-hover:text-sky-400 transition-colors">
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                </div>

                                <button
                                    className='text-sm w-full rounded-lg justify-center bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 px-3 py-2.5 font-semibold transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                    }}
                                >
                                    <i className="fas fa-shopping-cart mr-2"></i>
                                    Añadir al carrito
                                </button>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </>
    )
}