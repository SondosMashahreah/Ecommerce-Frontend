import { translateError } from "../../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAdminMessages,
} from "../../../services/api";

import "../AdminManagement.css";


function AdminMessages() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [messages, setMessages] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [unreadOnly, setUnreadOnly] =
    useState(false);

  const loadMessages = async () => {
    try {
      const data =
        await getAdminMessages(
          search,
          unreadOnly
        );

      setMessages(data);

    } catch (error) {
      alert(translateError(error.message));
    }
  };

  useEffect(() => {
    const timer =
      setTimeout(
        loadMessages,
        250
      );

    return () =>
      clearTimeout(timer);
  }, [search, unreadOnly]);

  return (
    <main className="admin_management_page">

      <div className="admin_management_header">
        <span>{t("CUSTOMER SUPPORT")}</span>

        <h1>{t("Messages")}</h1>

        <p>{t("Messages sent through the contact form.")}</p>
      </div>

      <div className="admin_toolbar">

        <input
          placeholder={t("Search messages...")}
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

<label className="unread_filter">
  <input
    type="checkbox"
    checked={unreadOnly}
    onChange={(event) =>
      setUnreadOnly(event.target.checked)
    }
  />

  <span className="unread_toggle">
    <span className="unread_toggle_circle" />
  </span>

  <span className="unread_filter_text">{t("Unread only")}</span>
</label>

      </div>

      <section className="admin_table_card">

        {messages.length === 0 ? (
          <div className="admin_empty_state">{t("No messages found.")}</div>

        ) : (
          <table className="admin_data_table">

            <thead>
              <tr>
                <th>{t("Status")}</th>
                <th>{t("From")}</th>
                <th>{t("Email")}</th>
                <th>{t("Subject")}</th>
                <th>{t("Date")}</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {messages.map(
                (message) => (
                  <tr key={message.id}>

                    <td>
                      <span
                        className={
                          message.is_read
                            ? "admin_status_badge"
                            : "admin_status_badge unread"
                        }
                      >
                        {message.is_read
                          ? t("Read")
                          : t("New")}
                      </span>
                    </td>

                    <td>
                      {message.name}
                    </td>

                    <td>
                      {message.email}
                    </td>

                    <td>
                      {message.subject}
                    </td>

                    <td>
                      {new Date(
                        message.created_at
                      ).toLocaleDateString(document.documentElement.lang)}
                    </td>

                    <td>
                      <button
                        className="admin_action_btn"
                        onClick={() =>
                          navigate(
                            `/admin/messages/${message.id}`
                          )
                        }
                      >{t("Open")}</button>
                    </td>

                  </tr>
                )
              )}
            </tbody>

          </table>
        )}

      </section>

    </main>
  );
}


export default AdminMessages;