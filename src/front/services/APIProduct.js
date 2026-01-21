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

export const productService = {
  getProducts,
  getProductById,
  createProduct,
};
