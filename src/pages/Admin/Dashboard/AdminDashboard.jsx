import { translateError, locale } from '../../../i18n';
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
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
  useTranslation(); // Subscribe this screen to language changes.

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
        <div className="admin_state">{t("Loading dashboard...")}</div>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="admin_dashboard_page">
        <div className="admin_error">
          {translateError(error) || t("Failed to load dashboard")}
        </div>
      </main>
    );
  }

  const stats = dashboard.stats;
  const chartDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? t(value) : date.toLocaleDateString(locale(), { month: 'short', day: 'numeric' });
  };
  const chartNumber = (value) => Number(value).toLocaleString(locale());

  const cards = [
    {
      label: t("Revenue"),
      value:
        `$${Number(
          stats.revenue
        ).toFixed(2)}`,
      icon: <FaDollarSign />,
    },
    {
      label: t("Orders"),
      value: stats.orders,
      icon: <FaShoppingBag />,
    },
    {
      label: t("Customers"),
      value: stats.customers,
      icon: <FaUsers />,
    },
    {
      label: t("Products"),
      value: stats.products,
      icon: <FaBox />,
    },
    {
      label: t("Low Stock"),
      value:
        stats.low_stock_products,
      icon: (
        <FaExclamationTriangle />
      ),
    },
    {
      label: t("Pending Orders"),
      value:
        stats.pending_orders,
      icon: <FaClock />,
    },
    {
      label: t("Refunds"),
      value: stats.refunds,
      icon: <FaUndo />,
    },
    {
      label: t("Avg. Order"),
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
            <span>{t("ADMIN PANEL")}</span>

            <h1>{t("Dashboard")}</h1>

            <p>{t("Overview of your store performance.")}</p>
          </div>
        </header>

        <nav className="feedback_quick_links" aria-label={t("Store management")}>
          <Link to="/admin/reviews">{t("Ratings & Reviews →")}</Link>
          <Link to="/admin/coupons">{t("Manage coupons →")}</Link>
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
                  {t(card.label, { defaultValue: card.label })}
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
            <h2>{t("Orders Over Time")}</h2>

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
                  dataKey="label" tickFormatter={chartDate}
                />

                <YAxis tickFormatter={chartNumber} allowDecimals={false} />

                <Tooltip labelFormatter={chartDate} formatter={(value, name) => [chartNumber(value), name]} />

                <Bar
                 dataKey="value" name={t("Orders")}
                 fill="#79c7e8"
                 radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="admin_chart_card">
            <h2>{t("New Customers")}</h2>

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
                  dataKey="label" tickFormatter={chartDate}
                />

                <YAxis tickFormatter={chartNumber} allowDecimals={false} />

                <Tooltip labelFormatter={chartDate} formatter={(value, name) => [chartNumber(value), name]} />

                <Line
                  type="monotone"
                  dataKey="value" name={t("New Customers")} stroke="#79c7e8" strokeWidth={2}
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