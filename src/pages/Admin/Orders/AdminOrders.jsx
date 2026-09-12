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
      alert(error.message);

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
        <span>ORDER MANAGEMENT</span>

        <h1>Orders</h1>

        <p>
          View and manage customer orders.
        </p>
      </div>

      <div className="admin_toolbar">

        <input
          placeholder="Search order ID, customer or email..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value
            )
          }
        >
          <option value="">
            All statuses
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="PROCESSING">
            Processing
          </option>

          <option value="READY">
            Ready
          </option>

          <option value="DONE">
            Done
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

          
        </select>

      </div>

      <section className="admin_table_card">

        {loading ? (
          <div className="admin_empty_state">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (
          <div className="admin_empty_state">
            No orders found.
          </div>

        ) : (
          <table className="admin_data_table">

            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
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
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="admin_action_btn"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                      >
                        View
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


export default AdminOrders;