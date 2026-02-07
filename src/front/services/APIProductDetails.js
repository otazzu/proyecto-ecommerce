const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getToken = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de sesión");
  }
  return token;
};

const getTechnicalDetails = async (productId) => {
  try {
    const response = await fetch(
      `${backendUrl}api/product_technical_details/product/${productId}/technical-details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || data.message || "Error al obtener detalles técnicos",
    };
  } catch (error) {
    console.error("Error al obtener detalles técnicos:", error);
    return {
      success: false,
      error: "Error de conexión al obtener detalles técnicos",
    };
  }
};

const createTechnicalDetails = async (productId, technicalData) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${backendUrl}api/product_technical_details/product/${productId}/technical-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(technicalData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al crear detalles técnicos",
    };
  } catch (error) {
    console.error("Error al crear detalles técnicos:", error);
    return {
      success: false,
      error: "Error de conexión al crear detalles técnicos",
    };
  }
};

const updateTechnicalDetails = async (productId, technicalData) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${backendUrl}api/product_technical_details/product/${productId}/technical-details`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(technicalData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al actualizar detalles técnicos",
    };
  } catch (error) {
    console.error("Error al actualizar detalles técnicos:", error);
    return {
      success: false,
      error: "Error de conexión al actualizar detalles técnicos",
    };
  }
};

export const technicalDetailsService = {
  getTechnicalDetails,
  createTechnicalDetails,
  updateTechnicalDetails,
};
