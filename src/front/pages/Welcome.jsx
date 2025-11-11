import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/APIUser";
import { Spinner } from "../components/Spinner";


export const Welcome = () => {

    const [error, setError] = useState("")
    const [allowed, setAllowed] = useState(true)
    const [user, setUser] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [navigate])

    const fetchData = async () => {
        try {
            setAllowed(true)
            const response = await userService.ProtectedPage()
            if (!response.success) {
                setAllowed(false)
                setError(response.error)
                countDown()
            }
            if (response.data.rol.type === "seller") {
                setIsAdmin(true)
            }
            const userName = response.data.user_name
            setUser(userName)
            console.log(userName)

        } catch (error) {
            console.log(error)
        }

    }

    const countDown = () => {
        setTimeout(() => {
            navigate("/login")
        }, 3000)
    }

    return (
        <div>
            {allowed ?
                <div className="text-center mt-5">
                    <h1 className="mb-5 text-white">¡Bienvenido</h1>
                    {isAdmin ? <>
                        <h1 className="text-white">{user}!</h1><p className="text-white">Usuario con privilegio administrador</p>
                    </> : (
                        <>
                            <h2 className="noto-sans-jp-title text-white p-3">{user}!</h2>
                        </>)}
                    <Link to="/login" className="text-decoration-none px-25 py-2.5 bg-pink-600 rounded-md text-m/6 font-semibold text-white hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Log out</Link>
                </div>
                :
                (
                    <div className="d-flex flex-column vh-100">
                        <div className="my-auto">
                            <div className="alert alert-danger w-100" role="alert">
                                <div className="d-flex justify-content-center">
                                    {error}
                                </div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <p className="my-0 mx-2 text-white">Redirigiendo al login</p>
                                <Spinner />
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}