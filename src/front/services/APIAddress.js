const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAllAddresses = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${backendUrl}api/address/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al obtener direcciones",
    };
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    return {
      success: false,
      error: "Error de conexión al obtener direcciones",
    };
  }
};

const getAddressById = async (addressId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `${backendUrl}api/address/addresses/${addressId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al obtener dirección",
    };
  } catch (error) {
    console.error("Error al obtener dirección:", error);
    return {
      success: false,
      error: "Error de conexión al obtener dirección",
    };
  }
};

const getDefaultAddress = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${backendUrl}api/address/addresses/default`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al obtener dirección por defecto",
    };
  } catch (error) {
    console.error("Error al obtener dirección por defecto:", error);
    return {
      success: false,
      error: "Error de conexión al obtener dirección por defecto",
    };
  }
};

const createAddress = async (addressData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${backendUrl}api/address/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al crear dirección",
    };
  } catch (error) {
    console.error("Error al crear dirección:", error);
    return {
      success: false,
      error: "Error de conexión al crear dirección",
    };
  }
};

const updateAddress = async (addressId, addressData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `${backendUrl}api/address/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(addressData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al actualizar dirección",
    };
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    return {
      success: false,
      error: "Error de conexión al actualizar dirección",
    };
  }
};

const deleteAddress = async (addressId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `${backendUrl}api/address/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || data.warning || "Error al eliminar dirección",
    };
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    return {
      success: false,
      error: "Error de conexión al eliminar dirección",
    };
  }
};

const setDefaultAddress = async (addressId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `${backendUrl}api/address/addresses/${addressId}/set-default`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al establecer dirección por defecto",
    };
  } catch (error) {
    console.error("Error al establecer dirección por defecto:", error);
    return {
      success: false,
      error: "Error de conexión al establecer dirección por defecto",
    };
  }
};

export const addressService = {
  getAllAddresses,
  getAddressById,
  getDefaultAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
