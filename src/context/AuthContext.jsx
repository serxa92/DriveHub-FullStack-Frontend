import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

  const saveSession = useCallback((nextSession) => {
    if (!nextSession?.user || !nextSession?.token) {
      throw new Error("Invalid authentication response");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const logoutIfCurrent = useCallback((expectedToken) => {
    setSession((currentSession) => {
      if (currentSession?.token !== expectedToken) return currentSession;
      localStorage.removeItem(STORAGE_KEY);
      return null;
    });
  }, []);

  const login = useCallback(async (credentials) => {
    const nextSession = await loginUser(credentials);
    saveSession(nextSession);
    return nextSession.user;
  }, [saveSession]);

  // El backend no da token al registrar, así que iniciamos sesión después.
  const register = useCallback(async (userData) => {
    await registerUser(userData);
    return login({ email: userData.email, password: userData.password });
  }, [login]);

  useEffect(() => {
    const validateSession = () => {
      if (session?.token && isTokenExpired(session.token)) {
        logoutIfCurrent(session.token);
      }
    };
    const syncSession = (event) => {
      if (event.key === STORAGE_KEY) setSession(getStoredSession());
    };

    validateSession();
    const interval = window.setInterval(validateSession, 30000);
    window.addEventListener("storage", syncSession);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", syncSession);
    };
  }, [logoutIfCurrent, session?.token]);

  // Todas las peticiones privadas pasan por aquí para llevar el token.
  const authFetch = useCallback(async (path, options) => {
    if (!session?.token) {
      throw new Error("Authentication required");
    }
    if (isTokenExpired(session.token)) {
      logoutIfCurrent(session.token);
      throw new Error("Authentication required");
    }

    const requestToken = session.token;
    const response = await authenticatedFetch(path, requestToken, options);
    if (response.status === 401) logoutIfCurrent(requestToken);
    return response;
  }, [logoutIfCurrent, session?.token]);

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
