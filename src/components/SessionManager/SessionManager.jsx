import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import { refreshSession } from "../../services/api";

import "./SessionManager.css";

const GRACE_PERIOD_MINUTES = 30;

function getTokenExpiration(token) {
  try {
    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return decodedPayload.exp * 1000;
  } catch {
    return null;
  }
}


function SessionManager() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [showModal, setShowModal] =
    useState(false);

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setShowModal(false);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/signin");
  }, [navigate]);


  const checkSession = useCallback(() => {
    const accessToken =
      localStorage.getItem("access_token");

    const refreshToken =
      localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      setShowModal(false);
      return;
    }

    const expiration =
      getTokenExpiration(accessToken);

    if (!expiration) {
      logout();
      return;
    }

    const now = Date.now();

    const graceDeadline =
      expiration +
      GRACE_PERIOD_MINUTES * 60 * 1000;


    if (now < expiration) {
      setShowModal(false);
      setRemainingSeconds(0);
      return;
    }


    if (
      now >= expiration &&
      now < graceDeadline
    ) {
      setShowModal(true);

      setRemainingSeconds(
        Math.ceil(
          (graceDeadline - now) / 1000
        )
      );

      return;
    }


    if (now >= graceDeadline) {
      logout();
    }

  }, [logout]);


  useEffect(() => {
    checkSession();

    const interval = setInterval(
      checkSession,
      1000
    );

    window.addEventListener(
      "authChanged",
      checkSession
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "authChanged",
        checkSession
      );
    };
  }, [checkSession]);


  const handleExtendSession = async () => {
    try {
      const refreshToken =
        localStorage.getItem("refresh_token");

      if (!refreshToken) {
        logout();
        return;
      }

      const data = await refreshSession(
        refreshToken
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );

      setShowModal(false);
      setRemainingSeconds(0);

      window.dispatchEvent(
        new Event("authChanged")
      );

    } catch (error) {
      console.error(
        "Failed to extend session:",
        error
      );

      logout();
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };


  if (!showModal) {
    return null;
  }


  return (
    <div className="session_overlay">

      <div className="session_modal">

        <h2>{t("Session Expired")}</h2>

        <p>{t("Your session has expired. Would you like to extend your session?")}</p>

        <p className="session_timer">{t("Time remaining:")}{" "}{" "}
          {formatTime(remainingSeconds)}
        </p>

        <div className="session_buttons">

          <button
            className="extend_session_btn"
            onClick={handleExtendSession}
          >{t("Extend Session")}</button>

          <button
            className="logout_session_btn"
            onClick={logout}
          >{t("Logout")}</button>

        </div>

      </div>

    </div>
  );
}

export default SessionManager;