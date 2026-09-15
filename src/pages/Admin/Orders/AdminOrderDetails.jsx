import i18n from '../../../i18n';
import { localizedProductName } from '../../../i18n/productContent';
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
  cancelAdminOrder,
  downloadAdminOrderInvoice,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../../../services/api";

import "../AdminManagement.css";


const ORDER_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DONE",
];


function AdminOrderDetails() {
  useTranslation(); // Subscribe this screen to language changes.

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);


  const loadOrder = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminOrderById(id);

      setOrder(data);

    } catch (error) {
      alert(translateError(error.message));

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrder();
  }, [id]);


  const changeStatus = async (
    newStatus
  ) => {
    if (
      working ||
      newStatus === order.status
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        t("order.changeStatus", { from: t(order.status), to: t(newStatus) })
      );

    if (!confirmed) {
      return;
    }

    try {
      setWorking(true);

      await updateAdminOrderStatus(
        order.id,
        newStatus
      );

      await loadOrder();

    } catch (error) {
      alert(translateError(error.message));

    } finally {
      setWorking(false);
    }
  };


  const cancel = async () => {
    if (
      !window.confirm(
        t("Cancel this order?")
      )
    ) {
      return;
    }

    try {
      setWorking(true);

      await cancelAdminOrder(
        order.id
      );

      await loadOrder();

    } catch (error) {
      alert(translateError(error.message));

    } finally {
      setWorking(false);
    }
  };


  const getStepState = (
    step,
    index
  ) => {
    const currentIndex =
      ORDER_STEPS.indexOf(
        order.status
      );

    if (currentIndex === -1) {
      return "";
    }

    if (index < currentIndex) {
      return "completed";
    }

    if (index === currentIndex) {
      return "current";
    }

    return "";
  };


  if (loading) {
    return (
      <main className="admin_management_page">{t("Loading order...")}</main>
    );
  }


  if (!order) {
    return (
      <main className="admin_management_page">{t("Order not found")}</main>
    );
  }


  const isSpecialStatus =
    !ORDER_STEPS.includes(
      order.status
    );


  return (
    <main className="admin_management_page">

      <button
        type="button"
        className="admin_back_btn"
        onClick={() =>
          navigate("/admin/orders")
        }
      >{t("Back to Orders")}</button>


      <div className="admin_management_header">
        <span>{t("ORDER DETAILS")}</span>

        <h1>{t("Order #")}{" "}{order.id}
        </h1>

        <p>{t("Customer and order information.")}</p>
      </div>


      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>{t("Customer")}</span>

            <strong>
              {order.customer.name === "Guest" ? t("Guest") : order.customer.name}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>{t("Email")}</span>

            <strong>
              {order.customer.email}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>{t("Status")}</span>

            <strong>
              {t(order.status, { defaultValue: order.status })}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>{t("Total")}</span>

            <strong>
              $
              {Number(
                order.total_amount
              ).toFixed(2)}
            </strong>
          </div>

        </div>


        <div className="admin_order_actions">

          <button
            type="button"
            className="admin_action_btn secondary"
            onClick={() =>
              downloadAdminOrderInvoice(
                order.id
              )
            }
          >{t("Download Invoice")}</button>


          {![
            "DONE",
            "CANCELLED",
            "RETURNED",
            "REFUNDED",
            "RETURN_REQUESTED",
            "REFUND_REQUESTED",
          ].includes(order.status) && (

            <button
              type="button"
              className="admin_action_btn danger"
              onClick={cancel}
              disabled={working}
            >{t("Cancel Order")}</button>

          )}

        </div>

      </section>


      <section className="admin_detail_card">

        <div className="admin_order_progress_header">
          <div>
            <h2>{t("Order Progress")}</h2>

            <p>{t("Select a stage to update the order status.")}</p>
          </div>

          <span className="admin_current_status">
            {t(order.status, { defaultValue: order.status })}
          </span>
        </div>


        {!isSpecialStatus ? (

          <div className="admin_order_timeline">

            {ORDER_STEPS.map(
              (step, index) => (

                <div
                  key={step}
                  className="admin_timeline_step"
                >

                  <button
                    type="button"
                    className={
                      `admin_timeline_dot ${
                        getStepState(
                          step,
                          index
                        )
                      }`
                    }
                    onClick={() =>
                      changeStatus(step)
                    }
                    disabled={working}
                    title={t("order.changeTo", { status: t(step) })}
                  >
                    {index + 1}
                  </button>


                  <span
                    className={
                      `admin_timeline_label ${
                        getStepState(
                          step,
                          index
                        )
                      }`
                    }
                  >
                    {t(step, { defaultValue: step })}
                  </span>


                  {index <
                    ORDER_STEPS.length -
                      1 && (

                    <div
                      className={
                        `admin_timeline_line ${
                          index <
                          ORDER_STEPS.indexOf(
                            order.status
                          )
                            ? "completed"
                            : ""
                        }`
                      }
                    />

                  )}

                </div>

              )
            )}

          </div>

        ) : (

          <div className="admin_special_status">{t("Current order status:")}<strong>
              {t(order.status, { defaultValue: order.status })}
            </strong>

          </div>

        )}

      </section>


      <section className="admin_detail_card">

        <h2>{t("Items")}</h2>

        <table className="admin_data_table">

          <thead>
            <tr>
              <th>{t("Product")}</th>
              <th>{t("SKU")}</th>
              <th>{t("Price")}</th>
              <th>{t("Qty")}</th>
              <th>{t("Subtotal")}</th>
            </tr>
          </thead>


          <tbody>

            {order.items.map(
              (item) => (

                <tr key={item.id}>

                  <td>
                    {localizedProductName(item.product_name, i18n.language)}
                  </td>

                  <td>
                    {item.sku}
                  </td>

                  <td>
                    $
                    {Number(
                      item.unit_price
                    ).toFixed(2)}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    $
                    {Number(
                      item.subtotal
                    ).toFixed(2)}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </section>


      <section className="admin_detail_card">

        <h2>{t("Status History")}</h2>

        <div className="admin_status_history">

          {order.status_history.map(
            (history) => (

              <div
                key={history.id}
                className="admin_status_history_item"
              >

                <strong>
                  {t(history.status, { defaultValue: history.status })}
                </strong>

                <span>
                  {new Date(
                    history.created_at
                  ).toLocaleString(document.documentElement.lang)}
                </span>

              </div>

            )
          )}

        </div>

      </section>

    </main>
  );
}


export default AdminOrderDetails;