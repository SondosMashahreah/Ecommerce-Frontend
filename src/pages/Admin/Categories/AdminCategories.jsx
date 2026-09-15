import i18n from '../../../i18n';
import { localizedProductName } from '../../../i18n/productContent';
import { translateError } from "../../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../../i18n";
import { useEffect, useState } from "react";
import { getAdminProducts } from "../../../services/api";

function AdminCategories() {
  useTranslation(); // Subscribe this screen to language changes.

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const products = await getAdminProducts();

        const groupedCategories = products.reduce(
          (result, product) => {
            const category =
              product.category?.trim() || "Uncategorized";

            if (!result[category]) {
              result[category] = 0;
            }

            result[category] += 1;

            return result;
          },
          {}
        );

        const categoryList = Object.entries(
          groupedCategories
        ).map(([name, productCount]) => ({
          name,
          productCount,
        }));

        setCategories(categoryList);
      } catch (error) {
        setError(
          error.message || t("Failed to load categories")
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <main style={styles.page}>
        <p>{t("Loading categories...")}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <p style={styles.label}>{t("PRODUCT MANAGEMENT")}</p>

        <h1 style={styles.title}>{t("Categories")}</h1>

        <p style={styles.subtitle}>{t("View the categories currently used by your products.")}</p>
      </div>

      {error && (
        <div style={styles.error}>
          {translateError(error)}
        </div>
      )}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t("Total Categories")}</span>

          <strong style={styles.statValue}>
            {categories.length}
          </strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>{t("Products")}</span>

          <strong style={styles.statValue}>
            {categories.reduce(
              (total, category) =>
                total + category.productCount,
              0
            )}
          </strong>
        </div>
      </div>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>{t("Product Categories")}</h2>

            <p style={styles.cardDescription}>{t("Categories are generated from the category assigned to each product.")}</p>
          </div>

          <span style={styles.countBadge}>
            {categories.length} {" "}{t("categories")}</span>
        </div>

        {categories.length === 0 ? (
          <div style={styles.empty}>{t("No categories found.")}</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>{t("Category")}</span>
              <span>{t("Products")}</span>
            </div>

            {categories.map((category) => (
              <div
                key={localizedProductName(category.name, i18n.language)}
                style={styles.row}
              >
                <div style={styles.categoryInfo}>
                  <div style={styles.categoryIcon}>
                    {localizedProductName(category.name, i18n.language)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong style={styles.categoryName}>
                      {localizedProductName(category.name, i18n.language)}
                    </strong>

                    <p style={styles.categoryText}>{t("Product category")}</p>
                  </div>
                </div>

                <span style={styles.productCount}>
                  {category.productCount}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "42px",
    background: "var(--surface-base, #f5f8fa)",
  },

  header: {
    marginBottom: "30px",
  },

  label: {
    margin: 0,
    color: "var(--text-muted, #7493a2)",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
  },

  title: {
    margin: "7px 0",
    color: "var(--text-strong, #152d40)",
    fontSize: "34px",
  },

  subtitle: {
    margin: 0,
    color: "var(--text-muted, #81909d)",
    fontSize: "15px",
  },

  error: {
    marginBottom: "20px",
    padding: "14px 16px",
    borderRadius: "9px",
    background: "#fff1f1",
    color: "#b94747",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  statCard: {
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "var(--surface-card, #ffffff)",
    border: "1px solid #e1e8ed",
    borderRadius: "14px",
  },

  statLabel: {
    color: "var(--text-muted, #7b8f9d)",
    fontSize: "13px",
  },

  statValue: {
    color: "var(--text-strong, #152d40)",
    fontSize: "28px",
  },

  card: {
    overflow: "hidden",
    background: "var(--surface-card, #ffffff)",
    border: "1px solid #e1e8ed",
    borderRadius: "15px",
  },

  cardHeader: {
    padding: "24px 26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom: "1px solid #edf1f3",
  },

  cardTitle: {
    margin: "0 0 5px",
    color: "var(--text-strong, #233c4f)",
    fontSize: "19px",
  },

  cardDescription: {
    margin: 0,
    color: "var(--text-muted, #81909d)",
    fontSize: "13px",
  },

  countBadge: {
    padding: "8px 12px",
    borderRadius: "20px",
    background: "#eaf5fa",
    color: "#4b91b0",
    fontSize: "12px",
    fontWeight: 700,
  },

  table: {
    width: "100%",
  },

  tableHeader: {
    padding: "13px 26px",
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    color: "var(--text-muted, #80929f)",
    background: "var(--surface-raised, #fafcfd)",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },

  row: {
    padding: "17px 26px",
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    alignItems: "center",
    borderTop: "1px solid #edf1f3",
  },

  categoryInfo: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  categoryIcon: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "#eaf2e4",
    color: "#4e7159",
    fontWeight: 800,
  },

  categoryName: {
    color: "var(--text-strong, #233c4f)",
    fontSize: "14px",
  },

  categoryText: {
    margin: "3px 0 0",
    color: "var(--text-muted, #93a1aa)",
    fontSize: "12px",
  },

  productCount: {
    width: "45px",
    padding: "7px 0",
    textAlign: "center",
    borderRadius: "20px",
    background: "#edf7fb",
    color: "#5796b1",
    fontWeight: 700,
  },

  empty: {
    padding: "50px",
    textAlign: "center",
    color: "var(--text-muted, #81909d)",
  },
};

export default AdminCategories;