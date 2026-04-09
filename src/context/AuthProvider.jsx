import { useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("carwash-user")) || null,
  );

  const login = async (email, password) => {
    try {
      const res = await api.post(`/auth/login`, {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res?.data?.token);

    } catch (error) {
      return { error: error.response };
    }
  };

  const logout=()=>{
    setUser(null);
    localStorage.removeItem("token");
  }



  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
