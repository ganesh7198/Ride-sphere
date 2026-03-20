import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/Apipath";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data  = await axios.get(
          `${BASE_URL}${API_PATHS.AUTH.MY_PROFILE}`,
          { withCredentials: true }
        );
        if (data.data.success) {
          setUser(data.data.userInfo);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
