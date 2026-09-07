import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBox,
  FaFileInvoice,
  FaRedo,
  FaTimesCircle,
  FaUndoAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  getOrderById,
  cancelOrder,
  requestOrderReturn,
  requestOrderRefund,
  reorderOrder,
  downloadOrderInvoice,
} from "../../services/api";

import "./OrderDetails.css";


const ORDER_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DONE",
];


function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");


  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);

      setOrder(data);

    } catch (error) {
      setError(
        error.message ||
        "Failed to load order"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrder();
  }, [id]);


  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setWorking(true);

      const updated =
        await cancelOrder(order.id);

      setOrder(updated);

    } catch (error) {
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const handleReturn = async () => {
    const confirmed = window.confirm(
      "Do you want to request a return for this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setWorking(true);

      const updated =
        await requestOrderReturn(order.id);

      setOrder(updated);

    } catch (error) {
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const handleRefund = async () => {
    const confirmed = window.confirm(
      "Do you want to request a refund for this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setWorking(true);

      const updated =
        await requestOrderRefund(order.id);

      setOrder(updated);

    } catch (error) {
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const handleReorder = async () => {
    try {
      setWorking(true);

      const result =
        await reorderOrder(order.id);

      alert(
        result.message ||
        "Order added to cart"
      );

      navigate("/cart");

    } catch (error) {
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const handleInvoice = async () => {
    try {
      setWorking(true);

      await downloadOrderInvoice(order.id);

    } catch (error) {
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const getStatusClass = (status) => {
    return `details_status details_status_${status.toLowerCase()}`;
  };


  const isStepCompleted = (step) => {
    const currentIndex =
      ORDER_STEPS.indexOf(order.status);

    const stepIndex =
      ORDER_STEPS.indexOf(step);

    if (currentIndex === -1) {
      return false;
    }

    return stepIndex <= currentIndex;
  };


  if (loading) {
    return (
      <div className="order_details_page">
        <div className="order_details_state">
          Loading order details...
        </div>
      </div>
    );
  }


  if (error || !order) {
    return (
      <div className="order_details_page">
        <div className="order_details_error">
          {error || "Order not found"}
        </div>
      </div>
    );
  }


  const canCancel = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
  ].includes(order.status);

  const canReturn =
    order.status === "DONE";

  const canRefund =
    order.status === "DONE";


  return (
    <main className="order_details_page">

      <div className="order_details_container">

        <button
          type="button"
          className="back_orders_btn"
          onClick={() => navigate("/orders")}
        >
          <FaArrowLeft />
          Back to Orders
        </button>


        <div className="order_details_header">

          <div>
            <p className="order_details_eyebrow">
              ORDER DETAILS
            </p>

            <h1>
              Order #{order.id}
            </h1>

            <p>
              Placed on{" "}
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>
          </div>


          <span
            className={
              getStatusClass(order.status)
            }
          >
            {order.status}
          </span>

        </div>


        <section className="order_timeline_section">

          <h2>
            Order Progress
          </h2>

          <div className="order_timeline">

            {ORDER_STEPS.map((step, index) => (
              <div
                key={step}
                className={
                  `timeline_step ${
                    isStepCompleted(step)
                      ? "completed"
                      : ""
                  }`
                }
              >

                <div className="timeline_dot">
                  {index + 1}
                </div>

                <span>
                  {step}
                </span>

                {index <
                  ORDER_STEPS.length - 1 && (
                  <div className="timeline_line" />
                )}

              </div>
            ))}

          </div>

        </section>


        <div className="order_details_grid">

          <section className="order_items_section">

            <div className="section_title">
              <FaBox />
              <h2>
                Items
              </h2>
            </div>


            <div className="order_items_list">

              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="order_detail_item"
                >

                  <div>
                    <h3>
                      {item.product_name}
                    </h3>

                    <p>
                      SKU: {item.sku}
                    </p>
                  </div>


                  <div className="order_item_numbers">

                    <span>
                      Qty: {item.quantity}
                    </span>

                    <span>
                      $
                      {Number(
                        item.unit_price
                      ).toFixed(2)}
                    </span>

                    <strong>
                      $
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </strong>

                  </div>

                </article>
              ))}

            </div>

          </section>


          <aside className="order_details_summary">

            <h2>
              Order Summary
            </h2>

            <div className="details_summary_row">
              <span>
                Items
              </span>

              <strong>
                {order.items.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </strong>
            </div>


            <div className="details_summary_row">
              <span>
                Shipping
              </span>

              <strong>
                Free
              </strong>
            </div>


            <div className="details_summary_divider" />


            <div className="details_summary_total">
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


            <div className="order_details_actions">

              <button
                type="button"
                onClick={handleInvoice}
                disabled={working}
              >
                <FaFileInvoice />
                Download Invoice
              </button>


              <button
                type="button"
                onClick={handleReorder}
                disabled={working}
              >
                <FaRedo />
                Reorder
              </button>


              {canCancel && (
                <button
                  type="button"
                  className="danger_action"
                  onClick={handleCancel}
                  disabled={working}
                >
                  <FaTimesCircle />
                  Cancel Order
                </button>
              )}


              {canReturn && (
                <button
                  type="button"
                  onClick={handleReturn}
                  disabled={working}
                >
                  <FaUndoAlt  />
                  Request Return
                </button>
              )}


              {canRefund && (
                <button
                  type="button"
                  onClick={handleRefund}
                  disabled={working}
                >
                  <FaMoneyBillWave  />
                  Request Refund
                </button>
              )}

            </div>

          </aside>

        </div>


        <section className="status_history_section">

          <h2>
            Status History
          </h2>

          <div className="status_history_list">

            {order.status_history.map(
              (history) => (
                <div
                  key={history.id}
                  className="status_history_item"
                >
                  <span
                    className={
                      getStatusClass(
                        history.status
                      )
                    }
                  >
                    {history.status}
                  </span>

                  <time>
                    {new Date(
                      history.created_at
                    ).toLocaleString()}
                  </time>
                </div>
              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}


export default OrderDetails;