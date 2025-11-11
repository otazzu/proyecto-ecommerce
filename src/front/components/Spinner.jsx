import React from "react";
import { Link } from "react-router-dom"


export const Spinner = () => {
    return (
        <>
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </>
    )

}