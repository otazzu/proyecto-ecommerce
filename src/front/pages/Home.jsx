import React from "react";

export const Home = () => {
    const user = sessionStorage.getItem("user")
    const userName = user ? JSON.parse(user).first_name : 'Invitado';

    return (
        <div>
            <div className="text-center mt-5">
                <h1 className="mb-5 text-white">¡Bienvenido!</h1>
            </div>
        </div>
    )
}