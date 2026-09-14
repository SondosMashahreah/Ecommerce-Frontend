import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import {
  useEffect,
  useState,
} from "react";

import {
  FaStar,
  FaTicket,
  FaChartPie,
  FaBox,
  FaLayerGroup,
  FaBagShopping,
  FaUsers,
  FaWarehouse,
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa6";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
} from "../../../services/api";

import "./AdminSidebar.css";


function AdminSidebar({
  collapsed,
  setCollapsed,
}) {
  useTranslation(); // Subscribe this screen to language changes.

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
    <aside
      className={
        `admin_sidebar ${
          collapsed ? "collapsed" : ""
        }`
      }
    >

      {/* TOP */}

      <div className="admin_sidebar_header">

        <div className="admin_sidebar_brand">
          <span className="admin_brand_full">
            ECOMMERCE
          </span>

          <span className="admin_brand_short">
            E
          </span>
        </div>


        <button
          type="button"
          className="admin_sidebar_toggle"
          onClick={() =>
            setCollapsed(!collapsed)
          }
          title={
            collapsed
              ? t("Open sidebar")
              : t("Close sidebar")
          }
        >
          {collapsed ? (
            <FaBars />
          ) : (
            <FaChevronLeft />
          )}
        </button>

      </div>


      <p className="admin_sidebar_label">{t("STORE ADMINISTRATION")}</p>


      {/* NAVIGATION */}

      <nav className="admin_sidebar_nav">

        <NavLink
          to="/admin"
          end
          className={navClass}
          title={t("Overview")}
        >
          <FaChartPie />
          <span>{t("Overview")}</span>
        </NavLink>


        <NavLink
          to="/admin/products"
          className={navClass}
          title={t("Products")}
        >
          <FaBox />
          <span>{t("Products")}</span>
        </NavLink>


        <NavLink
          to="/admin/categories"
          className={navClass}
          title={t("Categories")}
        >
          <FaLayerGroup />
          <span>{t("Categories")}</span>
        </NavLink>


        <NavLink
          to="/admin/inventory"
          className={navClass}
          title={t("Inventory")}
        >
          <FaWarehouse />
          <span>{t("Inventory")}</span>
        </NavLink>


        <div className="admin_sidebar_divider" />


        <NavLink
          to="/admin/orders"
          className={navClass}
          title={t("Orders")}
        >
          <FaBagShopping />
          <span>{t("Orders")}</span>
        </NavLink>


        <NavLink
          to="/admin/customers"
          className={navClass}
          title={t("Customers")}
        >
          <FaUsers />
          <span>{t("Customers")}</span>
        </NavLink>


        <NavLink
          to="/admin/messages"
          className={navClass}
          title={t("Messages")}
        >
          <FaEnvelope />
          <span>{t("Messages")}</span>
        </NavLink>

        <NavLink to="/admin/reviews" className={navClass} title={t("Ratings & Reviews")}><FaStar /><span>{t("Ratings & Reviews")}</span></NavLink>
        <NavLink to="/admin/coupons" className={navClass} title={t("Coupons")}><FaTicket /><span>{t("Coupons")}</span></NavLink>
      </nav>


      {/* BOTTOM */}

      <div className="admin_sidebar_bottom">

        <button
          type="button"
          className="admin_storefront_btn"
          onClick={() =>
            navigate("/")
          }
          title={t("View storefront")}
        >
          <span>{t("View storefront")}</span>

          <FaArrowUpRightFromSquare />
        </button>


        <div className="admin_account">

          <div className="admin_account_text">

            <strong>{t("Administrator")}</strong>

            <span>
              {adminUser?.name || t("Admin")}
            </span>

          </div>


          <button
            type="button"
            className="admin_logout_icon"
            onClick={logout}
            title={t("Logout")}
          >
            <FaArrowRightFromBracket />
          </button>

        </div>

      </div>

    </aside>
  );
}


export default AdminSidebar;