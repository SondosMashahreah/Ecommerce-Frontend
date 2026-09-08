import {
  useEffect,
  useState,
} from "react";

import {
  FaChartPie,
  FaBox,
  FaLayerGroup,
  FaBagShopping,
  FaUsers,
  FaWarehouse,
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaEnvelope,
} from "react-icons/fa6";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
} from "../../../services/api";

import "./AdminSidebar.css";


function AdminSidebar() {
  const navigate = useNavigate();

  const [adminUser, setAdminUser] =
    useState(null);


  useEffect(() => {
    const loadAdminUser = async () => {
      try {
        const user =
          await getCurrentUser();

        setAdminUser(user);
      } catch (error) {
        console.error(
          "Failed to load admin user:",
          error
        );
      }
    };

    loadAdminUser();
  }, []);


  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/signin");
  };


  const navClass = ({
    isActive,
  }) =>
    isActive
      ? "admin_nav_item active"
      : "admin_nav_item";


  return (
    <aside className="admin_sidebar">

      <div className="admin_sidebar_brand">
        ECOMMERCE
      </div>

      <p className="admin_sidebar_label">
        STORE ADMINISTRATION
      </p>


      <nav className="admin_sidebar_nav">

        <NavLink
          to="/admin"
          end
          className={navClass}
        >
          <FaChartPie />
          <span>Overview</span>
        </NavLink>


        <NavLink
          to="/admin/products"
          className={navClass}
        >
          <FaBox />
          <span>Products</span>
        </NavLink>


        <NavLink
          to="/admin/categories"
          className={navClass}
        >
          <FaLayerGroup />
          <span>Categories</span>
        </NavLink>


        <NavLink
          to="/admin/inventory"
          className={navClass}
        >
          <FaWarehouse />
          <span>Inventory</span>
        </NavLink>


        <div className="admin_sidebar_divider" />


        <button
          type="button"
          className="admin_nav_item admin_nav_button"
        >
          <FaBagShopping />
          <span>Orders</span>
        </button>


        <button
          type="button"
          className="admin_nav_item admin_nav_button"
        >
          <FaUsers />
          <span>Customers</span>
        </button>


        <button
          type="button"
          className="admin_nav_item admin_nav_button"
        >
          <FaEnvelope />
          <span>Messages</span>
        </button>

      </nav>


      <div className="admin_sidebar_bottom">

        <button
          type="button"
          className="admin_storefront_btn"
          onClick={() =>
            navigate("/")
          }
        >
          <span>
            View storefront
          </span>

          <FaArrowUpRightFromSquare />
        </button>


        <div className="admin_account">

          <div className="admin_account_text">

            <strong>
              Administrator
            </strong>

            <span>
              {adminUser?.name || "Admin"}
            </span>

          </div>


          <button
            type="button"
            className="admin_logout_icon"
            onClick={logout}
            title="Logout"
          >
            <FaArrowRightFromBracket />
          </button>

        </div>

      </div>

    </aside>
  );
}


export default AdminSidebar;