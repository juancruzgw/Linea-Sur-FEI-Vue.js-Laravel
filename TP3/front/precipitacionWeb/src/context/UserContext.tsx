import { createContext, useContext, useState, ReactNode } from "react";
import useUser from "../hooks/useUser";

type UserContextType = {
  user: any;
  password: string;
  fetchGetUserByPassword: (e: React.FormEvent) => Promise<void>;
  handleSavePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectReport: any;
  report: any;
  isLogin: any;
  handleLogout: () => void;
  getUsername: () => string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [report, setReport] = useState<any | null>(null);

  const handleSelectReport = (report: any) => {
    setReport(report);
  };

  const { user, fetchGetUserByPassword, isLogin, password, handleSavePassword, handleLogout, getUsername } = useUser();

  return (
    <UserContext.Provider
      value={{
        user,
        password,
        fetchGetUserByPassword,
        handleSavePassword,
        handleSelectReport,
        report,
        isLogin,
        handleLogout,
        getUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext debe usarse dentro de <UserProvider>");
  }
  return ctx;
};