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
        alert(error.message);
      }
    };

    load();
  }, [id]);

  if (!customer) {
    return (
      <main className="admin_management_page">
        Loading customer...
      </main>
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
      >
        Back to Customers
      </button>

      <div className="admin_management_header">
        <span>CUSTOMER DETAILS</span>

        <h1>
          {customer.name}
        </h1>
      </div>

      <section className="admin_detail_card">

        <div className="admin_detail_grid">

          <div className="admin_detail_item">
            <span>Name</span>
            <strong>
              {customer.name}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Username</span>
            <strong>
              {customer.username}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Email</span>
            <strong>
              {customer.email}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Role</span>
            <strong>
              {customer.role}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Status</span>
            <strong>
              {customer.is_active
                ? "Active"
                : "Disabled"}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Verified</span>
            <strong>
              {customer.is_verified
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="admin_detail_item">
            <span>Joined</span>
            <strong>
              {new Date(
                customer.created_at
              ).toLocaleString()}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}


export default AdminCustomerDetails;