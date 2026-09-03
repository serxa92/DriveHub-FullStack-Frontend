import { createContext, useContext, useState } from "react";
import {
  authenticatedFetch,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();
const STORAGE_KEY = "drivehub-auth";

const isTokenExpired = (token) => {
  try {
    // Adaptamos el token al formato que entiende atob.
    const encodedPayload = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = encodedPayload.padEnd(
      encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(paddedPayload));

    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Recuperamos la sesión guardada si sigue siendo válida.
const getStoredSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!session?.user || !session?.token || isTokenExpired(session.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  const saveSession = (nextSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const login = async (credentials) => {
    const nextSession = await loginUser(credentials);
    saveSession(nextSession);
    return nextSession.user;
  };

  // El backend no da token al registrar, así que iniciamos sesión después.
  const register = async (userData) => {
    await registerUser(userData);
    return login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  // Todas las peticiones privadas pasan por aquí para llevar el token.
  const authFetch = (path, options) => {
    if (!session?.token) {
      throw new Error("Authentication required");
    }

    return authenticatedFetch(path, session.token, options);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        token: session?.token || null,
        isAuthenticated: Boolean(session?.token),
        login,
        register,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
