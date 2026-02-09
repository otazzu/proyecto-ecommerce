import React, { useState, useEffect } from "react";

const INITIAL_TECHNICAL_STATE = {
    manufacturer: "",
    collection: "",
    anime_series: "",
    character: "",
};

export const ProductTechnicalDetail = ({
    productId,
    initialData,
    onSave,
    showButtons = false
}) => {
    const [formData, setFormData] = useState(INITIAL_TECHNICAL_STATE);

    useEffect(() => {
        if (initialData) {
            setFormData({
                manufacturer: initialData.manufacturer || "",
                collection: initialData.collection || "",
                anime_series: initialData.anime_series || "",
                character: initialData.character || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (onSave && !showButtons) {

            onSave(formData);
        }
    }, [formData, onSave, showButtons]);

    return (
        <div className="border-2 border-gray-700 bg-gray-800 rounded-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
                {initialData ? "Editar Detalles Técnicos" : "Agregar Detalles Técnicos"}
            </h3>
            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Fabricante
                        </label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            placeholder="Ej: Good Smile Company"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Colección
                        </label>
                        <input
                            type="text"
                            name="collection"
                            value={formData.collection}
                            onChange={handleChange}
                            placeholder="Ej: Nendoroid"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Serie de anime
                        </label>
                        <input
                            type="text"
                            name="anime_series"
                            value={formData.anime_series}
                            onChange={handleChange}
                            placeholder="Ej: Dragon Ball Z"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Personaje
                        </label>
                        <input
                            type="text"
                            name="character"
                            value={formData.character}
                            onChange={handleChange}
                            placeholder="Ej: Son Goku"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};