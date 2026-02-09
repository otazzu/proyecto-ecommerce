import React, { useState, useEffect } from "react";
import { addressService } from "../services/APIAddress";
import { Spinner } from "../components/Spinner";

const INITIAL_ADDRESS_STATE = {
    street: "",
    number: "",
    apartment: "",
    city: "",
    province: "",
    postal_code: "",
    country: "España",
    phone: "",
    is_default: false,
};

export const ManageAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState(INITIAL_ADDRESS_STATE);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await addressService.getAllAddresses();
            if (response.success) {
                setAddresses(response.data);
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Error al cargar las direcciones");
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            let response;
            if (editingAddress) {
                response = await addressService.updateAddress(
                    editingAddress.id,
                    formData
                );
            } else {
                response = await addressService.createAddress(formData);
            }

            if (response.success) {
                setSuccess(
                    editingAddress
                        ? "Dirección actualizada exitosamente"
                        : "Dirección creada exitosamente"
                );
                setShowForm(false);
                setEditingAddress(null);
                setFormData(INITIAL_ADDRESS_STATE);
                fetchAddresses();
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Error al guardar la dirección");
        }
        setLoading(false);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            street: address.street || "",
            number: address.number || "",
            apartment: address.apartment || "",
            city: address.city || "",
            province: address.province || "",
            postal_code: address.postal_code || "",
            country: address.country || "España",
            phone: address.phone || "",
            is_default: address.is_default || false,
        });
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta dirección?")) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await addressService.deleteAddress(addressId);
            if (response.success) {
                setSuccess("Dirección eliminada exitosamente");
                fetchAddresses();
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Error al eliminar la dirección");
        }
        setLoading(false);
    };

    const handleSetDefault = async (addressId) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await addressService.setDefaultAddress(addressId);
            if (response.success) {
                setSuccess("Dirección establecida como predeterminada");
                fetchAddresses();
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Error al establecer dirección predeterminada");
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
        setFormData(INITIAL_ADDRESS_STATE);
        setError("");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Mis Direcciones</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                    >
                        + Nueva Dirección
                    </button>
                )}
            </div>

            {success && (
                <div className="bg-green-950 text-green-400 p-3 rounded-md text-center">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-950 text-red-400 p-3 rounded-md text-center">
                    {error}
                </div>
            )}

            {loading && (
                <div className="text-center my-3">
                    <Spinner />
                </div>
            )}

            {showForm && (
                <div className="border-2 border-gray-700 bg-gray-800 rounded-md p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                        {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Calle *
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Número *
                                </label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Piso/Puerta
                                </label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Ciudad *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Provincia *
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Código Postal *
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    País
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_default"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={handleChange}
                                className="w-4 h-4 text-sky-600 bg-gray-700 border-gray-600 rounded focus:ring-sky-600"
                            />
                            <label
                                htmlFor="is_default"
                                className="ml-2 text-sm text-gray-100"
                            >
                                Establecer como dirección predeterminada
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                            >
                                {editingAddress ? "Actualizar" : "Guardar"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!loading && addresses.length === 0 && !showForm && (
                <div className="text-center text-gray-400 py-8">
                    No tienes direcciones guardadas. ¡Agrega una nueva!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="border-2 border-gray-700 bg-gray-800 rounded-md p-4 relative"
                    >
                        {address.is_default && (
                            <span className="absolute top-2 right-2 bg-sky-700 text-white text-xs px-2 py-1 rounded-full">
                                Predeterminada
                            </span>
                        )}
                        <div className="mb-3 text-white">
                            <p className="font-semibold">
                                {address.street}, {address.number}
                            </p>
                            {address.apartment && <p>{address.apartment}</p>}
                            <p>
                                {address.city}, {address.province}
                            </p>
                            <p>
                                {address.postal_code}, {address.country}
                            </p>
                            {address.phone && <p className="mt-1">Tel: {address.phone}</p>}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(address)}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Editar
                            </button>
                            {!address.is_default && (
                                <button
                                    onClick={() => handleSetDefault(address.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Selct. Predet.
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};