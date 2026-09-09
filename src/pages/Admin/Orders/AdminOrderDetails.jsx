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
      alert(error.message);

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
        `Change order status from ${order.status} to ${newStatus}?`
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
      alert(error.message);

    } finally {
      setWorking(false);
    }
  };


  const cancel = async () => {
    if (
      !window.confirm(
        "Cancel this order?"
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
      alert(error.message);

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
      <main className="admin_management_page">
        Loading order...
      </main>
    );
  }


  if (!order) {
    return (
      <main className="admin_management_page">
        Order not found
      </main>
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
      >
        Back to Orders
      </button>


      <div className="admin_management_header">
        <span>ORDER DETAILS</span>

        <h1>
          Order #{order.id}
        </h1>

        <p>
          Customer and order information.
        </p>
      </div>


      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>Customer</span>

            <strong>
              {order.customer.name}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>Email</span>

            <strong>
              {order.customer.email}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>Status</span>

            <strong>
              {order.status}
            </strong>
          </div>


          <div className="admin_detail_item">
            <span>Total</span>

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
          >
            Download Invoice
          </button>


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
            >
              Cancel Order
            </button>

          )}

        </div>

      </section>


      <section className="admin_detail_card">

        <div className="admin_order_progress_header">
          <div>
            <h2>Order Progress</h2>

            <p>
              Select a stage to update
              the order status.
            </p>
          </div>

          <span className="admin_current_status">
            {order.status}
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
                    title={`Change status to ${step}`}
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
                    {step}
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

          <div className="admin_special_status">

            Current order status:

            <strong>
              {order.status}
            </strong>

          </div>

        )}

      </section>


      <section className="admin_detail_card">

        <h2>Items</h2>

        <table className="admin_data_table">

          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>


          <tbody>

            {order.items.map(
              (item) => (

                <tr key={item.id}>

                  <td>
                    {item.product_name}
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

        <h2>Status History</h2>

        <div className="admin_status_history">

          {order.status_history.map(
            (history) => (

              <div
                key={history.id}
                className="admin_status_history_item"
              >

                <strong>
                  {history.status}
                </strong>

                <span>
                  {new Date(
                    history.created_at
                  ).toLocaleString()}
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