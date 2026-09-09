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
      alert(error.message);
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
        <span>CUSTOMER SUPPORT</span>

        <h1>Messages</h1>

        <p>
          Messages sent through
          the contact form.
        </p>
      </div>

      <div className="admin_toolbar">

        <input
          placeholder="Search messages..."
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

  <span className="unread_filter_text">
    Unread only
  </span>
</label>

      </div>

      <section className="admin_table_card">

        {messages.length === 0 ? (
          <div className="admin_empty_state">
            No messages found.
          </div>

        ) : (
          <table className="admin_data_table">

            <thead>
              <tr>
                <th>Status</th>
                <th>From</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
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
                          ? "Read"
                          : "New"}
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
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="admin_action_btn"
                        onClick={() =>
                          navigate(
                            `/admin/messages/${message.id}`
                          )
                        }
                      >
                        Open
                      </button>
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