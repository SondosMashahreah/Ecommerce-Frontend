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
      alert(error.message);
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
      alert(error.message);
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
      alert(error.message);
    }
  };

  return (
    <main className="admin_management_page">

      <div className="admin_management_header">
        <span>USER MANAGEMENT</span>

        <h1>Customers</h1>

        <p>
          Search and manage user accounts.
        </p>
      </div>

      <div className="admin_toolbar">
        <input
          placeholder="Search name, username or email..."
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
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => (
                <tr key={customer.id}>

                  <td>
                    {customer.name}
                  </td>

                  <td>
                    {customer.username}
                  </td>

                  <td>
                    {customer.email}
                  </td>

                  <td>
                    <select
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
                      <option value="customer">
                        Customer
                      </option>

                      <option value="admin">
                        Admin
                      </option>
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
                        ? "Active"
                        : "Disabled"}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString()}
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
                      >
                        View
                      </button>

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
                          ? "Disable"
                          : "Enable"}
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