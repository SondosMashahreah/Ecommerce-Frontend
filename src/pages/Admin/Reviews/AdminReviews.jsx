import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { getAdminReviews } from "../../../services/api";
import "../AdminManagement.css";
import "../Feedback.css";

export default function AdminReviews() {
  const [data, setData] = useState({ items: [], total: 0, average: 0, page_size: 25 });
  const [search, setSearch] = useState("");
  const [stars, setStars] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const result = await getAdminReviews({ search, page, ...(stars ? { stars } : {}) });
        if (active) setData(result);
      } catch (err) { if (active) setError(err.message); }
      finally { if (active) setLoading(false); }
    }, 200);
    return () => { active = false; clearTimeout(timer); };
  }, [search, stars, page, retry]);
  const changeFilter = (setter, value) => { setter(value); setPage(1); setLoading(true); };
  return <main className="admin_management_page">
    <header className="admin_management_header"><span>CUSTOMER FEEDBACK</span><h1>Ratings & Reviews</h1><p>See product ratings and what your customers are saying.</p></header>
    <div className="admin_toolbar">
      <input aria-label="Search reviews" placeholder="Search product, customer or review..." value={search} onChange={(e) => changeFilter(setSearch, e.target.value)} />
      <select aria-label="Filter by stars" value={stars} onChange={(e) => changeFilter(setStars, e.target.value)}><option value="">All ratings</option>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
    </div>
    {error ? <div role="alert" className="feedback_error">{error} <button onClick={() => setRetry((n) => n + 1)}>Retry</button></div>
      : loading ? <p role="status">Loading reviews...</p> : <>
        <p className="feedback_summary">{data.total} ratings · {data.average} / 5 average{search || stars ? " (filtered)" : ""}</p>
        <section className="admin_table_card">
          {!data.items.length ? <div className="admin_empty_state">No reviews match your filters.</div> : <table className="admin_data_table feedback_table">
            <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th></tr></thead>
            <tbody>{data.items.map((review) => <tr key={review.id}>
              <td><Link to={`/admin/products/${review.product_id}`}>{review.product_name}</Link></td><td>{review.user_name}</td>
              <td><Rating value={review.rating} readOnly size="small" /><span className="feedback_rating_value">{review.rating}/5</span></td>
              <td className="feedback_comment">{review.comment || "Rating only — no written review"}</td>
            </tr>)}</tbody>
          </table>}
        </section>
        <nav className="feedback_actions" aria-label="Reviews pagination">
          <button className="admin_action_btn secondary" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}>Previous</button>
          <span>Page {page} of {Math.max(1, Math.ceil(data.total / data.page_size))}</span>
          <button className="admin_action_btn secondary" disabled={page * data.page_size >= data.total} onClick={() => { setLoading(true); setPage(page + 1); }}>Next</button>
        </nav>
      </>}
  </main>;
}
