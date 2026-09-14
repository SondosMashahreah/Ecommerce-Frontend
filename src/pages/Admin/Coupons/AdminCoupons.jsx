import { useEffect, useRef, useState } from "react";
import { getAdminCoupons, createAdminCoupon, updateAdminCoupon } from "../../../services/api";
import "../AdminManagement.css";
import "../Feedback.css";

const emptyCoupon = { code: "", discount_type: "percent", discount_value: "", minimum_order: "0", is_active: true };
export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ ...emptyCoupon });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const codeInput = useRef(null);
  const load = async () => {
    setLoading(true); setLoadError("");
    try { setCoupons(await getAdminCoupons()); }
    catch (err) { setLoadError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    let active = true;
    getAdminCoupons().then((data) => { if (active) setCoupons(data); })
      .catch((err) => { if (active) setLoadError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const reset = () => { setForm({ ...emptyCoupon }); setEditing(null); setError(""); };
  const change = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const payload = { ...form, code: form.code.trim().toUpperCase() };
      const saved = editing === null ? await createAdminCoupon(payload) : await updateAdminCoupon(editing, payload);
      setCoupons((previous) => [saved, ...previous.filter((item) => item.id !== saved.id)]);
      reset(); setMessage(`Coupon ${saved.code} saved.`);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const edit = (coupon) => {
    setEditing(coupon.id);
    setForm({ code: coupon.code, discount_type: coupon.discount_type, discount_value: String(coupon.discount_value), minimum_order: String(coupon.minimum_order), is_active: coupon.is_active });
    setError(""); setMessage(""); codeInput.current?.focus();
  };
  return <main className="admin_management_page">
    <header className="admin_management_header"><span>STORE OFFERS</span><h1>Coupons</h1><p>Create discounts, set minimum orders and control which offers are active.</p></header>
    <section className="admin_detail_card">
      <h2>{editing === null ? "Create coupon" : "Edit coupon"}</h2>
      <form onSubmit={save} className="coupon_admin_form">
        <fieldset disabled={saving || loading || Boolean(loadError)}>
          <div className="coupon_admin_fields">
            <label>Coupon code<input ref={codeInput} required maxLength={50} pattern="[A-Za-z0-9_\-]+" placeholder="SUMMER15" value={form.code} onChange={(e) => change("code", e.target.value.toUpperCase())} /></label>
            <label>Discount type<select value={form.discount_type} onChange={(e) => change("discount_type", e.target.value)}><option value="percent">Percentage (%)</option><option value="fixed">Fixed amount ($)</option></select></label>
            <label>{form.discount_type === "percent" ? "Discount (%)" : "Discount ($)"}<input required type="number" min="0.01" max={form.discount_type === "percent" ? "100" : "9999999999.99"} step="0.01" value={form.discount_value} onChange={(e) => change("discount_value", e.target.value)} /></label>
            <label>Minimum order ($)<input required type="number" min="0" max="9999999999.99" step="0.01" value={form.minimum_order} onChange={(e) => change("minimum_order", e.target.value)} /></label>
          </div>
          <label className="coupon_active"><input type="checkbox" checked={form.is_active} onChange={(e) => change("is_active", e.target.checked)} />Active — customers can use this coupon</label>
          <div className="feedback_actions"><button className="admin_action_btn" type="submit">{saving ? "Saving..." : editing === null ? "Create coupon" : "Save changes"}</button>{editing !== null && <button className="admin_action_btn secondary" type="button" onClick={reset}>Cancel edit</button>}</div>
        </fieldset>
      </form>
      {error && <p className="feedback_error" role="alert">{error}</p>}
      {message && <p className="feedback_success" role="status">{message}</p>}
    </section>
    <h2>All coupons</h2>
    {loading ? <p role="status">Loading coupons...</p> : loadError ? <p role="alert" className="feedback_error">{loadError} <button onClick={load}>Retry</button></p> : <section className="admin_table_card">
      {!coupons.length ? <div className="admin_empty_state">No coupons yet. Create your first offer above.</div> : <table className="admin_data_table feedback_table">
        <thead><tr><th>Code</th><th>Discount</th><th>Minimum order</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{coupons.map((coupon) => <tr key={coupon.id}><td><strong>{coupon.code}</strong></td><td>{coupon.discount_type === "percent" ? `${Number(coupon.discount_value)}%` : `$${Number(coupon.discount_value).toFixed(2)}`}</td><td>${Number(coupon.minimum_order).toFixed(2)}</td><td><span className={`admin_status_badge ${coupon.is_active ? "active" : "disabled"}`}>{coupon.is_active ? "Active" : "Inactive"}</span></td><td><button className="admin_action_btn secondary" disabled={saving} onClick={() => edit(coupon)}>Edit <span className="feedback_sr_only">{coupon.code}</span></button></td></tr>)}</tbody>
      </table>}
    </section>}
  </main>;
}
