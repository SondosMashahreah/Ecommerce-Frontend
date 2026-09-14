import { translateError } from "../../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteAdminMessage,
  getAdminMessageById,
  markAdminMessageRead,
} from "../../../services/api";

import "../AdminManagement.css";


function AdminMessageDetails() {
  useTranslation(); // Subscribe this screen to language changes.

  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] =
    useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        let data =
          await getAdminMessageById(
            id
          );

        if (!data.is_read) {
          data =
            await markAdminMessageRead(
              id
            );
        }

        setMessage(data);

      } catch (error) {
        alert(translateError(error.message));
      }
    };

    load();
  }, [id]);

  const remove = async () => {
    if (
      !window.confirm(
        t("Delete this message?")
      )
    ) {
      return;
    }

    try {
      await deleteAdminMessage(
        id
      );

      navigate(
        "/admin/messages"
      );

    } catch (error) {
      alert(translateError(error.message));
    }
  };

  if (!message) {
    return (
      <main className="admin_management_page">{t("Loading message...")}</main>
    );
  }

  return (
    <main className="admin_management_page">

      <button
        className="admin_back_btn"
        onClick={() =>
          navigate(
            "/admin/messages"
          )
        }
      >{t("Back to Messages")}</button>

      <div className="admin_management_header">
        <span>{t("CUSTOMER MESSAGE")}</span>

        <h1>
          {message.subject}
        </h1>
      </div>

      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>{t("From")}</span>
            <strong>
              {message.name}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Email")}</span>
            <strong>
              {message.email}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Date")}</span>
            <strong>
              {new Date(
                message.created_at
              ).toLocaleString(document.documentElement.lang)}
            </strong>
          </div>

        </div>

        <div className="admin_message_body">
          {message.message}
        </div>

        <button
          className="admin_action_btn danger"
          style={{
            marginTop: 20,
          }}
          onClick={remove}
        >{t("Delete Message")}</button>

      </section>

    </main>
  );
}


export default AdminMessageDetails;