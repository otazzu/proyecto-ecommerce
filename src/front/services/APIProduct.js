const URL = import.meta.env.VITE_BACKEND_URL;

const getProducts = async () => {
  try {
    const response = await fetch(`${URL}api/product/products`);

    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
  }
};

const getActivesProducts = async () => {
  try {
    const response = await fetch(`${URL}api/product/products/actives`);

    if (!response.ok) {
      throw new Error("Error al obtener los productos activos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching active products: ${error}`);
  }
};

const getProductById = async (productId) => {
  try {
    const response = await fetch(`${URL}api/product/products/${productId}`);

    if (!response.ok) {
      throw new Error("Error al obtener el producto por ID");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener el producto por ID: ${error}`);
  }
};

const createProduct = async (productData) => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        error: "No se encontró el token de autenticación",
      };
    }

    const response = await fetch(`${URL}api/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        error: data.error || "Error al crear el producto",
      };
    }
  } catch (error) {
    console.error(`Error creating product: ${error}`);
    throw error;
  }
};

const checkProductStatus = async (productId, newStatus) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `${URL}api/product/selectproducttomodify/${productId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "No se pudo cambiar el estado",
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error de red o servidor" };
  }
};

const getCurrentProduct = async (id) => {
  try {
    const url = `${URL}api/product/selectproducttomodify/${id}`;
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No hay token de sesión" };
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    }
    return {
      success: false,
      error: data.error || "Error al obtener el producto",
    };
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return { success: false, error: "Error de conexión al obtener producto" };
  }
};

const updateProduct = async (id, productData) => {
  try {
    const url = `${URL}api/product/selectproducttomodify/${id}`;
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No hay token de sesión" };
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    }
    return {
      success: false,
      error: data.error || "Error al actualizar el producto",
    };
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return {
      success: false,
      error: "Error de conexión al actualizar el producto",
    };
  }
};

export const productService = {
  getProducts,
  getActivesProducts,
  getProductById,
  createProduct,
  checkProductStatus,
  getCurrentProduct,
  updateProduct,
};
