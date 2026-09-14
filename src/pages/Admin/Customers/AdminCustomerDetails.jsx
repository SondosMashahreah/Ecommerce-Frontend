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
  getAdminCustomerById,
} from "../../../services/api";

import "../AdminManagement.css";


function AdminCustomerDetails() {
  useTranslation(); // Subscribe this screen to language changes.

  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await getAdminCustomerById(
            id
          );

        setCustomer(data);

      } catch (error) {
        alert(translateError(error.message));
      }
    };

    load();
  }, [id]);

  if (!customer) {
    return (
      <main className="admin_management_page">{t("Loading customer...")}</main>
    );
  }

  return (
    <main className="admin_management_page">

      <button
        className="admin_back_btn"
        onClick={() =>
          navigate(
            "/admin/customers"
          )
        }
      >{t("Back to Customers")}</button>

      <div className="admin_management_header">
        <span>{t("CUSTOMER DETAILS")}</span>

        <h1>
          {customer.name}
        </h1>
      </div>

      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>{t("Name")}</span>
            <strong>
              {customer.name}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Username")}</span>
            <strong>
              {customer.username}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Email")}</span>
            <strong>
              {customer.email}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Role")}</span>
            <strong>
              {t(customer.role, { defaultValue: customer.role })}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Status")}</span>
            <strong>
              {customer.is_active
                ? t("Active")
                : t("Disabled")}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Verified")}</span>
            <strong>
              {customer.is_verified
                ? t("Yes")
                : t("No")}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>{t("Joined")}</span>
            <strong>
              {new Date(
                customer.created_at
              ).toLocaleString(document.documentElement.lang)}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}


export default AdminCustomerDetails;