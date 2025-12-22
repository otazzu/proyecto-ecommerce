const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignupUser = async (body, rolType) => {
  try {
    const response = await fetch(`${backendUrl}api/user/signup/${rolType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al registrar usuario",
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      error: "Error de conexión al registrar usuario",
    };
  }
};

const LoginUser = async (body) => {
  try {
    const response = await fetch(`${backendUrl}api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.id) {
          sessionStorage.setItem("user_id", data.user.id);
        }
        window.dispatchEvent(new Event("userChanged"));
      }
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al iniciar sesión",
    };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return {
      success: false,
      error: "Error de conexión al iniciar sesión",
    };
  }
};

const ProtectedPage = async () => {
  try {
    const url = `${backendUrl}api/user/welcome`;
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, error: "Acceso no autorizado" };
    }
    const response = await fetch(url, {
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
    return { success: false, error: data.error || "Error al obtener usuario" };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { success: false, error: "Error de conexión al obtener usuario" };
  }
};

export const userService = {
  SignupUser,
  LoginUser,
  ProtectedPage,
};
