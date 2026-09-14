import { Link } from "react-router-dom";
import "../Feedback.css";
import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"; 

import {
  FaDollarSign,
  FaShoppingBag,
  FaUsers,
  FaBox,
  FaExclamationTriangle,
  FaClock,
  FaUndo,
  FaChartLine,
} from "react-icons/fa";

import {
  getAdminDashboard,
} from "../../../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const data =
          await getAdminDashboard();

        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="admin_dashboard_page">
        <div className="admin_state">
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="admin_dashboard_page">
        <div className="admin_error">
          {error ||
            "Failed to load dashboard"}
        </div>
      </main>
    );
  }

  const stats = dashboard.stats;

  const cards = [
    {
      label: "Revenue",
      value:
        `$${Number(
          stats.revenue
        ).toFixed(2)}`,
      icon: <FaDollarSign />,
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: <FaShoppingBag />,
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: <FaUsers />,
    },
    {
      label: "Products",
      value: stats.products,
      icon: <FaBox />,
    },
    {
      label: "Low Stock",
      value:
        stats.low_stock_products,
      icon: (
        <FaExclamationTriangle />
      ),
    },
    {
      label: "Pending Orders",
      value:
        stats.pending_orders,
      icon: <FaClock />,
    },
    {
      label: "Refunds",
      value: stats.refunds,
      icon: <FaUndo />,
    },
    {
      label: "Avg. Order",
      value:
        `$${Number(
          stats.average_order_value
        ).toFixed(2)}`,
      icon: <FaChartLine />,
    },
  ];

  return (
    <main className="admin_dashboard_page">
      <div className="admin_dashboard_container">

        <header className="admin_dashboard_header">
          <div>
            <span>
              ADMIN PANEL
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of your store
              performance.
            </p>
          </div>
        </header>

        <nav className="feedback_quick_links" aria-label="Store management">
          <Link to="/admin/reviews">Ratings & Reviews →</Link>
          <Link to="/admin/coupons">Manage coupons →</Link>
        </nav>
        <section className="admin_stats_grid">
          {cards.map((card) => (
            <article
              className="admin_stat_card"
              key={card.label}
            >
              <div className="admin_stat_icon">
                {card.icon}
              </div>

              <div>
                <span>
                  {card.label}
                </span>

                <strong>
                  {card.value}
                </strong>
              </div>
            </article>
          ))}
        </section>

        <section className="admin_charts_grid">

          <article className="admin_chart_card">
            <h2>
              Orders Over Time
            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <BarChart
                data={
                  dashboard
                    .orders_over_time
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                />

                <YAxis />

                <Tooltip />

                <Bar
                 dataKey="value"
                 fill="#79c7e8"
                 radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="admin_chart_card">
            <h2>
              New Customers
            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart
                data={
                  dashboard
                    .new_customers
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                />
              </LineChart>
            </ResponsiveContainer>
          </article>

        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;