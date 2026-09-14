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
  getAdminOrders,
} from "../../../services/api";

import "../AdminManagement.css";


function AdminOrders() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminOrders(
          search,
          status
        );

      setOrders(data);

    } catch (error) {
      alert(translateError(error.message));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer =
      setTimeout(
        loadOrders,
        250
      );

    return () =>
      clearTimeout(timer);
  }, [search, status]);

  return (
    <main className="admin_management_page">

      <div className="admin_management_header">
        <span>{t("ORDER MANAGEMENT")}</span>

        <h1>{t("Orders")}</h1>

        <p>{t("View and manage customer orders.")}</p>
      </div>

      <div className="admin_toolbar">

        <input
          placeholder={t("Search order ID, customer or email...")}
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={t(status, { defaultValue: status })}
          onChange={(event) =>
            setStatus(
              event.target.value
            )
          }
        >
          <option value="">{t("All statuses")}</option>

          <option value="PENDING">{t("Pending")}</option>

          <option value="CONFIRMED">{t("Confirmed")}</option>

          <option value="PROCESSING">{t("Processing")}</option>

          <option value="READY">{t("Ready")}</option>

          <option value="DONE">{t("Done")}</option>

          <option value="CANCELLED">{t("Cancelled")}</option>

          
        </select>

      </div>

      <section className="admin_table_card">

        {loading ? (
          <div className="admin_empty_state">{t("Loading orders...")}</div>

        ) : orders.length === 0 ? (
          <div className="admin_empty_state">{t("No orders found.")}</div>

        ) : (
          <table className="admin_data_table">

            <thead>
              <tr>
                <th>{t("Order")}</th>
                <th>{t("Customer")}</th>
                <th>{t("Email")}</th>
                <th>{t("Total")}</th>
                <th>{t("Status")}</th>
                <th>{t("Date")}</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {orders.map(
                (order) => (
                  <tr key={order.id}>

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {
                        order.customer
                          .name
                      }
                    </td>

                    <td>
                      {
                        order.customer
                          .email
                      }
                    </td>

                    <td>
                      $
                      {Number(
                        order.total_amount
                      ).toFixed(2)}
                    </td>

                    <td>
                      <span className="admin_status_badge">
                        {t(order.status, { defaultValue: order.status })}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString(document.documentElement.lang)}
                    </td>

                    <td>
                      <button
                        className="admin_action_btn"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                      >{t("View")}</button>
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


export default AdminOrders;