import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  getCurrentUser,
} from "../../services/api";


function AdminRoute({ children }) {
  useTranslation(); // Subscribe this screen to language changes.

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const data =
          await getCurrentUser();

        setUser(data);

      } catch {
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);


  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >{t("Checking admin access...")}</div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }


  if (user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


export default AdminRoute;
