import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { AdminAuthContext } from "./AdminAuthContext.js";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(() =>
    Boolean(sessionStorage.getItem("ijaaboAdminToken")),
  );

  useEffect(() => {
    let active = true;
    const token = sessionStorage.getItem("ijaaboAdminToken");
    if (!token)
      return () => {
        active = false;
      };

    api
      .get("/auth/me")
      .then(({ data }) => {
        if (active && data.user?.role === "ADMIN" && data.user.isActive)
          setAdmin(data.user);
        else if (active) sessionStorage.removeItem("ijaaboAdminToken");
      })
      .catch(() => {
        if (active) sessionStorage.removeItem("ijaaboAdminToken");
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function expireSession() {
      sessionStorage.removeItem("ijaaboAdminToken");
      setAdmin(null);
      setChecking(false);
    }
    window.addEventListener("ijaabo:admin-session-expired", expireSession);
    return () =>
      window.removeEventListener("ijaabo:admin-session-expired", expireSession);
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    if (!data.token || data.user?.role !== "ADMIN")
      throw new Error(
        "This account is not authorized to use the admin dashboard.",
      );
    sessionStorage.setItem("ijaaboAdminToken", data.token);
    setAdmin(data.user);
  }

  function logout() {
    sessionStorage.removeItem("ijaaboAdminToken");
    setAdmin(null);
  }

  const value = useMemo(
    () => ({ admin, checking, login, logout }),
    [admin, checking],
  );
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
