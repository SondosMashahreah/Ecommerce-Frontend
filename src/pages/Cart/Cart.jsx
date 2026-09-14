import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  getCart,
  removeCartItem,
  incrementCartItem,
  decrementCartItem,
  createOrder,
  validateCoupon
} from "../../services/api";

import "./Cart.css";

import ProductImage from "../../components/ProductImage/ProductImage";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creatingOrder, setCreatingOrder] =
  useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

const navigate = useNavigate();

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

const handleRemove = async (id) => {
  if (updatingItemId === id) return;

  try {
    setUpdatingItemId(id);

    await removeCartItem(id);

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
    setCoupon(null);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  } catch (error) {
    alert(error.message);
  } finally {
    setUpdatingItemId(null);
  }
};

const [updatingItemId, setUpdatingItemId] = useState(null);

const handleIncrement = async (id) => {
  if (updatingItemId === id) return;

  try {
    setUpdatingItemId(id);

    await incrementCartItem(id);

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              product: {
                ...item.product,
                stock: Math.max(
                  item.product.stock - 1,
                  0
                )
              }
            }
          : item
      )
    );
    setCoupon(null);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  } catch (error) {
    alert(error.message);
  } finally {
    setUpdatingItemId(null);
  }
};

const handleCreateOrder = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to place this order?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setCreatingOrder(true);

    const order = await createOrder(coupon?.code);

    setCart([]);

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    navigate(`/orders/${order.id}`);

  } catch (error) {
    alert(
      error.message ||
      "Failed to create order"
    );

  } finally {
    setCreatingOrder(false);
  }
};

const handleDecrement = async (id) => {
  if (updatingItemId === id) return;

  try {
    setUpdatingItemId(id);

    const currentItem = cart.find(
      (item) => item.id === id
    );

    if (!currentItem) return;

    await decrementCartItem(id);

    if (currentItem.quantity === 1) {
      setCart((currentCart) =>
        currentCart.filter(
          (item) => item.id !== id
        )
      );
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
                product: {
                  ...item.product,
                  stock: Math.min(
                    item.product.stock + 1,
                    item.product.stock_limit
                  )
                }
              }
            : item
        )
      );
    }
    setCoupon(null);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  } catch (error) {
    alert(error.message);
  } finally {
    setUpdatingItemId(null);
  }
};

  const itemsCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  );
  const total = coupon ? coupon.total : subtotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setApplyingCoupon(true);
      setCouponError("");
      setCoupon(await validateCoupon(couponCode, subtotal));
    } catch (error) {
      setCoupon(null);
      setCouponError(error.message);
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="cart_page">
        <div className="cart_state">
          Loading your cart...
        </div>
      </div>
    );
  }

  return (
    <main className="cart_page">
      <div className="cart_heading">
        <div>
          <p className="cart_eyebrow">Shopping Cart</p>
          <h1>My Cart</h1>
        </div>

        {cart.length > 0 && (
          <span className="cart_count">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <section className="empty_cart">
          <div className="empty_cart_icon">
            <FaShoppingBag />
          </div>

          <h2>Your cart is empty</h2>
          <p>Add some products and they will appear here.</p>

          <Link to="/" className="continue_shopping_btn">
            Continue Shopping
          </Link>
        </section>
      ) : (
        <div className="cart_layout">
          <section className="cart_items">
            {cart.map((item) => {
              const product = item.product;

              const itemTotal =
                Number(product.price) * item.quantity;

              return (
                <article className="cart_item" key={item.id}>
<ProductImage
  imagePath={product.image_path}
  alt={product.name}
  size="cart"
  className="cart_item_image"
/>

                  <div className="cart_item_info">
                    <h3>{product.name}</h3>

                    <div className="cart_item_meta">
                      <p>
                        <span>Price</span>
                        <strong>${Number(product.price).toFixed(2)}</strong>
                      </p>

<div className="quantity_section">
  <span className="quantity_label">
    Quantity
  </span>

  <div className="quantity_control">
<button
  type="button"
  onClick={() => handleDecrement(item.id)}
  disabled={updatingItemId === item.id}
>
  −
</button>

    <strong>{item.quantity}</strong>

<button
  type="button"
  onClick={() => handleIncrement(item.id)}
  disabled={
    updatingItemId === item.id ||
    product.stock === 0
  }
>
  +
</button>
  </div>
{product.stock === 0 && (
  <span className="stock_out">
    Out of Stock
  </span>
)}
</div>
                    </div>

                    <div className="cart_item_bottom">
                      <p className="item_total">
                        Item total:
                        <strong>${itemTotal.toFixed(2)}</strong>
                      </p>

<button
  type="button"
  className="remove_btn"
  onClick={() => handleRemove(item.id)}
  disabled={updatingItemId === item.id}
>
  <FaTrash />
  <span>Remove</span>
</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="order_summary">
            <h2>Order Summary</h2>

            <div className="summary_row">
              <span>Items</span>
              <strong>{itemsCount}</strong>
            </div>

            <div className="summary_row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary_row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="coupon_box">
              <div>
                <input
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value.toUpperCase());
                    setCoupon(null);
                    setCouponError("");
                  }}
                  placeholder="Coupon code"
                />
                <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
              {coupon && <p className="coupon_success">{coupon.code} applied — ${Number(coupon.discount_amount).toFixed(2)} off</p>}
              {couponError && <p className="coupon_error">{couponError}</p>}
            </div>

            {coupon && (
              <div className="summary_row discount_row">
                <span>Discount</span>
                <strong>-${coupon.discount_amount.toFixed(2)}</strong>
              </div>
            )}

            <div className="summary_divider" />

            <div className="summary_total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button
  type="button"
  className="checkout_btn"
  onClick={handleCreateOrder}
  disabled={creatingOrder}
>
  {creatingOrder
    ? "Placing Order..."
    : "Place Order"}
</button>

            <Link to="/" className="continue_shopping_link">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
