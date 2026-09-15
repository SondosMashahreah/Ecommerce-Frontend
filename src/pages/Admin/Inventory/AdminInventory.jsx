import i18n from '../../../i18n';
import { localizedProductName } from '../../../i18n/productContent';
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  getAdminProducts,
} from "../../../services/api";

function AdminInventory() {
  useTranslation(); // Subscribe this screen to language changes.

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
        <span>{t("INVENTORY")}</span>

        <h1>{t("Inventory Management")}</h1>

        <p>{t("Monitor stock, reservations and availability.")}</p>
      </div>

      <div className="admin_products_table">

        <div className="admin_products_table_head">
          <span>{t("Product")}</span>
          <span>{t("SKU")}</span>
          <span>{t("Stock")}</span>
          <span>{t("Reserved")}</span>
          <span>{t("Available")}</span>
          <span>{t("Status")}</span>
        </div>

        {items.map((item) => (
          <div
            className="admin_product_row"
            key={item.id}
          >
            <strong>
              {localizedProductName(item.product_name, i18n.language)}
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
              {t(item.stock_status, { defaultValue: item.stock_status })}
            </span>
          </div>
        ))}

      </div>

    </main>
  );
}

export default AdminInventory;