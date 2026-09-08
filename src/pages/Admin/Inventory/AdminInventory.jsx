import {
  useEffect,
  useState,
} from "react";

import {
  getAdminProducts,
} from "../../../services/api";

function AdminInventory() {
  const [items, setItems] =
    useState([]);

  useEffect(() => {
    const load = async () => {
      const products =
        await getAdminProducts();

      const result =
        products.flatMap(
          (product) =>
            product.items.map(
              (item) => ({
                ...item,
                product_name:
                  product.name,
              })
            )
        );

      setItems(result);
    };

    load();
  }, []);

  return (
    <main className="admin_form_page">

      <div className="admin_form_header">
        <span>INVENTORY</span>

        <h1>
          Inventory Management
        </h1>

        <p>
          Monitor stock,
          reservations and availability.
        </p>
      </div>

      <div className="admin_products_table">

        <div className="admin_products_table_head">
          <span>Product</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Reserved</span>
          <span>Available</span>
          <span>Status</span>
        </div>

        {items.map((item) => (
          <div
            className="admin_product_row"
            key={item.id}
          >
            <strong>
              {item.product_name}
            </strong>

            <span>
              {item.sku}
            </span>

            <span>
              {item.stock}
            </span>

            <span>
              {item.reserved_stock}
            </span>

            <span>
              {item.available_stock}
            </span>

            <span>
              {item.stock_status}
            </span>
          </div>
        ))}

      </div>

    </main>
  );
}

export default AdminInventory;