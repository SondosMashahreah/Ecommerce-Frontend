import { useEffect, useState, useId } from "react";
import Rating from "@mui/material/Rating";

import { rateProduct, getProductRating, getMyProductRating } from "../../services/api";
import "./ProductRating.css";

function ProductRatingContent({ productId, size = "small", showReviews = false }) {
  const reviewsId = useId();
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ratingInfo, setRatingInfo] = useState({
    average_rating: 0,
    ratings_count: 0,
    reviews: []
  });

  useEffect(() => {
    let active = true;
    const loadRatings = () => {
      Promise.all([
        getProductRating(productId),
        getMyProductRating(productId).catch(() => null),
      ]).then(([summary, mine]) => {
        if (!active) return;
        setRatingInfo(summary);
        setUserRating(mine?.rating || null);
        setComment(mine?.comment || "");
      }).catch((error) => {
        if (active) setMessage(error.message || "Failed to load reviews.");
      });
    };
    const refresh = (event) => {
      if (event.detail?.productId === productId) loadRatings();
    };
    loadRatings();
    window.addEventListener("ratingUpdated", refresh);
    return () => { active = false; window.removeEventListener("ratingUpdated", refresh); };
  }, [productId]);

  const saveRating = async (rating, reviewComment = null) => {
    setSaving(true);
    setMessage("");
    try {
      await rateProduct(productId, rating, reviewComment);
      setUserRating(rating);
      setRatingInfo(await getProductRating(productId));
      setMessage("Your review was saved.");
      window.dispatchEvent(new CustomEvent("ratingUpdated", { detail: { productId } }));
    } catch (error) {
      setMessage(error.message || "Failed to save your review.");
    } finally {
      setSaving(false);
    }
  };

  const handleRatingChange = (_event, value) => {
    if (!value) return;
    setUserRating(value);
    if (!showReviews) saveRating(value, comment);
  };

  return (
    <div className={`product_rating ${showReviews ? "product_rating--reviews" : ""}`}>
      <div className="rating_summary">
        <Rating
          name={`product-rating-${productId}`}
          value={userRating}
          onChange={handleRatingChange}
          size={size}
        />
        <span className="rating_info">
          {ratingInfo.ratings_count > 0
            ? `${ratingInfo.average_rating} (${ratingInfo.ratings_count})`
            : "No ratings"}
        </span>
      </div>

      {showReviews && (
        <>
          <div className="review_form">
            <textarea
              aria-label="Your review"
              rows={2}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              placeholder="Share your experience with this product..."
            />
            <button
              type="button"
              disabled={!userRating || saving}
              onClick={() => saveRating(userRating, comment)}
            >
              {saving ? "Saving..." : "Submit review"}
            </button>
            {message && <span className="review_message" role="status">{message}</span>}
          </div>

          <div className="reviews_list">
            <button type="button" className="reviews_toggle" aria-expanded={reviewsOpen}
              aria-controls={reviewsId} onClick={() => setReviewsOpen((open) => !open)}>
              {reviewsOpen ? "Hide" : "Show"} customer reviews ({ratingInfo.reviews?.length || 0})
              <span aria-hidden="true">{reviewsOpen ? "−" : "+"}</span>
            </button>
            <div id={reviewsId} hidden={!reviewsOpen}>
            {ratingInfo.reviews?.length ? ratingInfo.reviews.map((review) => (
              <article key={review.id} className="review_item">
                <div><strong>{review.user_name}</strong><Rating value={review.rating} readOnly size="small" /></div>
                <p>{review.comment}</p>
              </article>
            )) : <p className="no_reviews">No written reviews yet.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductRating(props) {
  return <ProductRatingContent key={props.productId} {...props} />;
}
