import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaEye,
  FaRedo,
  FaTimesCircle,
  FaFileInvoice,
} from "react-icons/fa";

import {
  getOrders,
  cancelOrder,
  reorderOrder,
  downloadOrderInvoice,
} from "../../services/api";

import "./Orders.css";


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionOrderId, setActionOrderId] =
    useState(null);

  const navigate = useNavigate();


  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);

    } catch (error) {
      alert(
        error.message ||
        "Failed to load orders"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrders();
  }, []);


  const handleCancel = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionOrderId(orderId);

      const updatedOrder =
        await cancelOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );

    } catch (error) {
      alert(error.message);

    } finally {
      setActionOrderId(null);
    }
  };


  const handleReorder = async (orderId) => {
    try {
      setActionOrderId(orderId);

      const result =
        await reorderOrder(orderId);

      alert(
        result.message ||
        "Order added to cart"
      );

      navigate("/cart");

    } catch (error) {
      alert(error.message);

    } finally {
      setActionOrderId(null);
    }
  };


  const handleInvoice = async (orderId) => {
    try {
      setActionOrderId(orderId);

      await downloadOrderInvoice(orderId);

    } catch (error) {
      alert(error.message);

    } finally {
      setActionOrderId(null);
    }
  };


  const getStatusClass = (status) => {
    return (
      `order_status order_status_${status.toLowerCase()}`
    );
  };


  if (loading) {
    return (
      <div className="orders_page">
        <div className="orders_state">
          Loading your orders...
        </div>
      </div>
    );
  }


  return (
    <main className="orders_page">

      <div className="orders_heading">
        <div>
          <p className="orders_eyebrow">
            MY ACCOUNT
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Track and manage your previous orders.
          </p>
        </div>

        <div className="orders_total_count">
          {orders.length} orders
        </div>
      </div>


      {orders.length === 0 ? (
        <section className="orders_empty">
          <div className="orders_empty_icon">
            <FaBoxOpen />
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            Once you place an order,
            it will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
          >
            Start Shopping
          </button>
        </section>
      ) : (
        <section className="orders_list">

          {orders.map((order) => {

            const isWorking =
              actionOrderId === order.id;

            const canCancel = [
              "PENDING",
              "CONFIRMED",
              "PROCESSING",
            ].includes(order.status);

            return (
              <article
                key={order.id}
                className="order_card"
              >

                <div className="order_card_header">

                  <div>
                    <span className="order_number">
                      Order #{order.id}
                    </span>

                    <p>
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={
                      getStatusClass(
                        order.status
                      )
                    }
                  >
                    {order.status}
                  </span>

                </div>


                <div className="order_card_body">

                  <div className="order_summary_info">
                    <div>
                      <span>
                        Items
                      </span>

                      <strong>
                        {order.items.reduce(
                          (total, item) =>
                            total +
                            item.quantity,
                          0
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total
                      </span>

                      <strong>
                        $
                        {Number(
                          order.total_amount
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>


                  <div className="order_products_preview">

                    {order.items
                      .slice(0, 3)
                      .map((item) => (
                        <span key={item.id}>
                          {item.product_name}
                          {" × "}
                          {item.quantity}
                        </span>
                      ))}

                    {order.items.length > 3 && (
                      <span>
                        +{order.items.length - 3}
                        {" "}more
                      </span>
                    )}

                  </div>

                </div>


                <div className="order_card_actions">

                  <button
                    type="button"
                    className="order_action_primary"
                    onClick={() =>
                      navigate(
                        `/orders/${order.id}`
                      )
                    }
                  >
                    <FaEye />
                    View Details
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleInvoice(order.id)
                    }
                    disabled={isWorking}
                  >
                    <FaFileInvoice />
                    Invoice
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleReorder(order.id)
                    }
                    disabled={isWorking}
                  >
                    <FaRedo />
                    Reorder
                  </button>


                  {canCancel && (
                    <button
                      type="button"
                      className="order_cancel_btn"
                      onClick={() =>
                        handleCancel(order.id)
                      }
                      disabled={isWorking}
                    >
                      <FaTimesCircle />
                      Cancel
                    </button>
                  )}

                </div>

              </article>
            );
          })}

        </section>
      )}

    </main>
  );
}


export default Orders;