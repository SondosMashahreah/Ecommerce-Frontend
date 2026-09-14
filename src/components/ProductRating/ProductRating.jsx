import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import { useEffect, useState, useId } from "react";
import Rating from "@mui/material/Rating";

import { rateProduct, getProductRating, getMyProductRating } from "../../services/api";
import "./ProductRating.css";

function ProductRatingContent({ productId, size = "small", showReviews = false }) {
  useTranslation(); // Subscribe this screen to language changes.

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
        if (active) setMessage(error.message || t("Failed to load reviews."));
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
      setMessage(t("Your review was saved."));
      window.dispatchEvent(new CustomEvent("ratingUpdated", { detail: { productId } }));
    } catch (error) {
      setMessage(error.message || t("Failed to save your review."));
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
        <Rating getLabelText={(value) => t("rating.stars", { count: value })} emptyLabelText={t("rating.empty")}
          name={`product-rating-${productId}`}
          value={userRating}
          onChange={handleRatingChange}
          size={size}
        />
        <span className="rating_info">
          {ratingInfo.ratings_count > 0
            ? `${ratingInfo.average_rating} (${ratingInfo.ratings_count})`
            : t("No ratings")}
        </span>
      </div>

      {showReviews && (
        <>
          <div className="review_form">
            <textarea
              aria-label={t("Your review")}
              rows={2}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              placeholder={t("Share your experience with this product...")}
            />
            <button
              type="button"
              disabled={!userRating || saving}
              onClick={() => saveRating(userRating, comment)}
            >
              {saving ? t("Saving...") : t("Submit review")}
            </button>
            {message && <span className="review_message" role="status">{message}</span>}
          </div>

          <div className="reviews_list">
            <button type="button" className="reviews_toggle" aria-expanded={reviewsOpen}
              aria-controls={reviewsId} onClick={() => setReviewsOpen((open) => !open)}>
              {t(reviewsOpen ? "reviews.hide" : "reviews.show", { count: ratingInfo.reviews?.length || 0 })}
              <span aria-hidden="true">{reviewsOpen ? "−" : "+"}</span>
            </button>
            <div id={reviewsId} hidden={!reviewsOpen}>
            {ratingInfo.reviews?.length ? ratingInfo.reviews.map((review) => (
              <article key={review.id} className="review_item">
                <div><strong>{review.user_name}</strong><Rating getLabelText={(value) => t("rating.stars", { count: value })} value={review.rating} readOnly size="small" /></div>
                <p>{review.comment}</p>
              </article>
            )) : <p className="no_reviews">{t("No written reviews yet.")}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductRating(props) {
  useTranslation(); // Subscribe this screen to language changes.

  return <ProductRatingContent key={props.productId} {...props} />;
}
