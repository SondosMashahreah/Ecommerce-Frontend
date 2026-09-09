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
        alert(error.message);
      }
    };

    load();
  }, [id]);

  const remove = async () => {
    if (
      !window.confirm(
        "Delete this message?"
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
      alert(error.message);
    }
  };

  if (!message) {
    return (
      <main className="admin_management_page">
        Loading message...
      </main>
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
      >
        Back to Messages
      </button>

      <div className="admin_management_header">
        <span>CUSTOMER MESSAGE</span>

        <h1>
          {message.subject}
        </h1>
      </div>

      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>From</span>
            <strong>
              {message.name}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Email</span>
            <strong>
              {message.email}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Date</span>
            <strong>
              {new Date(
                message.created_at
              ).toLocaleString()}
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
        >
          Delete Message
        </button>

      </section>

    </main>
  );
}


export default AdminMessageDetails;