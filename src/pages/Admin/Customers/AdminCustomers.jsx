import { translateError } from "../../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAdminCustomers,
  updateAdminCustomerRole,
  updateAdminCustomerStatus,
} from "../../../services/api";

import "../AdminManagement.css";


function AdminCustomers() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const loadCustomers = async () => {
    try {
      const data =
        await getAdminCustomers(
          search
        );

      setCustomers(data);

    } catch (error) {
      alert(translateError(error.message));
    }
  };

  useEffect(() => {
    const timer =
      setTimeout(
        loadCustomers,
        250
      );

    return () =>
      clearTimeout(timer);
  }, [search]);

  const changeStatus = async (
    customer
  ) => {
    try {
      await updateAdminCustomerStatus(
        customer.id,
        !customer.is_active
      );

      await loadCustomers();

    } catch (error) {
      alert(translateError(error.message));
    }
  };

  const changeRole = async (
    customer,
    role
  ) => {
    try {
      await updateAdminCustomerRole(
        customer.id,
        role
      );

      await loadCustomers();

    } catch (error) {
      alert(translateError(error.message));
    }
  };

  return (
    <main className="admin_management_page">

      <div className="admin_management_header">
        <span>{t("USER MANAGEMENT")}</span>

        <h1>{t("Customers")}</h1>

        <p>{t("Search and manage user accounts.")}</p>
      </div>

      <div className="admin_toolbar">
        <input
          placeholder={t("Search name, username or email...")}
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />
      </div>

      <section className="admin_table_card">

        <table className="admin_data_table">

          <thead>
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Username")}</th>
              <th>{t("Email")}</th>
              <th>{t("Role")}</th>
              <th>{t("Status")}</th>
              <th>{t("Joined")}</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => (
                <tr key={customer.id}>

                  <td>
                    {customer.role === "guest" ? t("Guest") : customer.name}
                  </td>

                  <td>
                    {customer.role === "guest" ? "—" : customer.username}
                  </td>

                  <td>
                    {customer.role === "guest" ? "—" : customer.email}
                  </td>

                  <td>
                    <select disabled={customer.role === "guest"}
                      value={
                        customer.role
                      }
                      onChange={(event) =>
                        changeRole(
                          customer,
                          event.target.value
                        )
                      }
                    >
                      {customer.role === "guest" && <option value="guest">{t("Guest")}</option>}
                      <option value="customer">{t("Customer")}</option>

                      <option value="admin">{t("Admin")}</option>
                    </select>
                  </td>

                  <td>
                    <span
                      className={
                        customer.is_active
                          ? "admin_status_badge active"
                          : "admin_status_badge disabled"
                      }
                    >
                      {customer.is_active
                        ? t("Active")
                        : t("Disabled")}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString(document.documentElement.lang)}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                      }}
                    >
                      <button
                        className="admin_action_btn"
                        onClick={() =>
                          navigate(
                            `/admin/customers/${customer.id}`
                          )
                        }
                      >{t("View")}</button>

                      <button
                        className={
                          customer.is_active
                            ? "admin_action_btn danger"
                            : "admin_action_btn secondary"
                        }
                        onClick={() =>
                          changeStatus(
                            customer
                          )
                        }
                      >
                        {customer.is_active
                          ? t("Disable")
                          : t("Enable")}
                      </button>
                    </div>
                  </td>

                </tr>
              )
            )}
          </tbody>

        </table>

      </section>

    </main>
  );
}


export default AdminCustomers;