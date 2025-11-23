import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export type Plan = "Gratuit" | "Plus" | "Entreprise";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updatePlan: (plan: Plan) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const register = (name: string, email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      plan: "Gratuit",
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updatePlan = (plan: Plan) => {
    if (user) {
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        register,
        logout,
        updatePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
