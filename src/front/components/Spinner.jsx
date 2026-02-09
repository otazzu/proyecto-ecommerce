import React from "react";
import { Link } from "react-router-dom"


export const Spinner = () => {
    return (
        <div className="text-white">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )

}