import { PreferencesToolbar } from '../../preferences/Controls';
import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import AdminSidebar
  from "../../components/Admin/AdminSidebar/AdminSidebar";

import "./AdminLayout.css";


function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (
    <div
      className={
        `admin_layout ${
          sidebarCollapsed
            ? "sidebar_collapsed"
            : ""
        }`
      }
    >

      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <section className="admin_layout_content">
        <PreferencesToolbar />
        <Outlet />
      </section>

    </div>
  );
}


export default AdminLayout;