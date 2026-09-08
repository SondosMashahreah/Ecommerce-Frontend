import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";

import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin_layout">
      <AdminSidebar />

      <section className="admin_layout_content">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;