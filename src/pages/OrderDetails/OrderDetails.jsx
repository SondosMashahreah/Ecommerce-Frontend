import { translateError } from "../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import i18n from "../../i18n";
import { localizedProductName } from "../../i18n/productContent";
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
  useTranslation(); // Subscribe this screen to language changes.

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
        t("Failed to load order")
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
      t("Are you sure you want to cancel this order?")
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
      alert(translateError(error.message));

    } finally {
      setWorking(false);
    }
  };


  const handleReturn = async () => {
    const confirmed = window.confirm(
      t("Do you want to request a return for this order?")
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
      alert(translateError(error.message));

    } finally {
      setWorking(false);
    }
  };


  const handleRefund = async () => {
    const confirmed = window.confirm(
      t("Do you want to request a refund for this order?")
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
      alert(translateError(error.message));

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
        t("Order added to cart")
      );

      navigate("/cart");

    } catch (error) {
      alert(translateError(error.message));

    } finally {
      setWorking(false);
    }
  };


  const handleInvoice = async () => {
    try {
      setWorking(true);

      await downloadOrderInvoice(order.id);

    } catch (error) {
      alert(translateError(error.message));

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
        <div className="order_details_state">{t("Loading order details...")}</div>
      </div>
    );
  }


  if (error || !order) {
    return (
      <div className="order_details_page">
        <div className="order_details_error">
          {error || t("Order not found")}
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
          <FaArrowLeft />{t("Back to Orders")}</button>


        <div className="order_details_header">

          <div>
            <p className="order_details_eyebrow">{t("ORDER DETAILS")}</p>

            <h1>{t("Order #")}{" "}{order.id}
            </h1>

            <p>{t("Placed on")}{" "}{" "}
              {new Date(
                order.created_at
              ).toLocaleString(document.documentElement.lang)}
            </p>
          </div>


          <span
            className={
              getStatusClass(order.status)
            }
          >
            {t(order.status, { defaultValue: order.status })}
          </span>

        </div>


        <section className="order_timeline_section">

          <h2>{t("Order Progress")}</h2>

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
                  {t(step, { defaultValue: step })}
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
              <h2>{t("Items")}</h2>
            </div>


            <div className="order_items_list">

              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="order_detail_item"
                >

                  <div>
                    <h3>
                      {localizedProductName(item.product_name, i18n.language)}
                    </h3>

                    <p>{t("SKU:")}{" "}{" "}{item.sku}
                    </p>
                  </div>


                  <div className="order_item_numbers">

                    <span>{t("Qty:")}{" "}{" "}{item.quantity}
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

            <h2>{t("Order Summary")}</h2>

            <div className="details_summary_row">
              <span>{t("Items")}</span>

              <strong>
                {order.items.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </strong>
            </div>


            <div className="details_summary_row">
              <span>{t("Shipping")}</span>

              <strong>{t("Free")}</strong>
            </div>


            <div className="details_summary_divider" />


            <div className="details_summary_total">
              <span>{t("Total")}</span>

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
                <FaFileInvoice />{t("Download Invoice")}</button>


              <button
                type="button"
                onClick={handleReorder}
                disabled={working}
              >
                <FaRedo />{t("Reorder")}</button>


              {canCancel && (
                <button
                  type="button"
                  className="danger_action"
                  onClick={handleCancel}
                  disabled={working}
                >
                  <FaTimesCircle />{t("Cancel Order")}</button>
              )}


              {canReturn && (
                <button
                  type="button"
                  onClick={handleReturn}
                  disabled={working}
                >
                  <FaUndoAlt  />{t("Request Return")}</button>
              )}


              {canRefund && (
                <button
                  type="button"
                  onClick={handleRefund}
                  disabled={working}
                >
                  <FaMoneyBillWave  />{t("Request Refund")}</button>
              )}

            </div>

          </aside>

        </div>


        <section className="status_history_section">

          <h2>{t("Status History")}</h2>

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
                    {t(history.status, { defaultValue: history.status })}
                  </span>

                  <time>
                    {new Date(
                      history.created_at
                    ).toLocaleString(document.documentElement.lang)}
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
