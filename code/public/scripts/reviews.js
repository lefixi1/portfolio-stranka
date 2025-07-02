document.addEventListener("DOMContentLoaded", () => {
  const tripId = document.body.dataset.tripId;
  const countryName = document.body.dataset.countryName;
  const currentUserId = document.body.dataset.userId;

  const reviewForm = document.getElementById("add-review-form");
  const reviewList = document.getElementById("reviews-list");
  const errorMessage = document.getElementById("review-error-message");
  const successMessage = document.getElementById("review-success-message");

  const toggleReviewsBtn = document.getElementById("toggle-reviews-btn");
  const toggleFormBtn = document.getElementById("toggle-form-btn");
  const reviewFormContainer = document.getElementById("review-form-container");

  const showConfirmDialog = window.showConfirmDialog;

  async function loadReviews() {
    try {
      const response = await fetch(
        `/Countries/${countryName}/${tripId}/reviews`
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews.");
      }

      const reviews = await response.json();

      reviewList.innerHTML = "";

      if (reviews.length === 0) {
        reviewList.innerHTML = "<li>No reviews yet.</li>";
        return;
      }

      if (reviews.length === 0) {
        reviewList.innerHTML = "<li>No reviews yet.</li>";
      } else {
        for (const review of reviews) {
          const li = document.createElement("li");
          li.classList.add("review-item");

          let stars = "";
          for (let i = 0; i < 5; i++) {
            stars +=
              i < review.rating
                ? "<span>&#9733;</span>"
                : "<span>&#9734;</span>";
          }

          li.innerHTML = `
          <div class="review-left">
          <div class="review-info">
        <p><strong>${review.reviewer_name || "Anonymous"}:</strong> ${
            review.text
          }</p>
        <p>Rating: ${stars}</p>
        <p>Date: ${review.date}</p>
        </div>
        <div class="controls">
          ${
            currentUserId &&
            review.user_id &&
            currentUserId === review.user_id.toString()
              ? `<button class="edit-btn" data-review-id="${
                  review.rev_id
                }" data-text="${review.text}" data-rating="${
                  review.rating
                }" data-image="${
                  review.imageLocation || ""
                }"><img src="/icons/edit icon.png" alt="edit"/>
              </button>
               
                 <button class="delete-button" 
                      data-type="review" 
                      data-review-id="${review.rev_id}" 
                      data-reviewer-name="${review.reviewer_name}"> 
                <img src="/icons/delete icon.png" alt="delete" />
              </button>`
              : ""
          }
        </div>
        </div>
        ${
          review.imageLocation
            ? `<div class="review-image"><img src="/images/${review.imageLocation}" alt="Review image"  />`
            : ""
        }
      `;

          reviewList.appendChild(li);

          const editBtn = li.querySelector(".edit-btn");
          if (editBtn) {
            editBtn.addEventListener("click", () => {
              const reviewId = editBtn.dataset.reviewId;
              const reviewText = editBtn.dataset.text;
              const reviewRating = editBtn.dataset.rating;
              const reviewImage = editBtn.dataset.image;
              reviewEditForm(reviewId, reviewText, reviewRating, reviewImage);
            });
          }

          const deleteBtn = li.querySelector(".delete-button");
          if (deleteBtn && showConfirmDialog) {
            deleteBtn.addEventListener("click", showConfirmDialog);
          }
        }
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(reviewForm);

      try {
        const response = await fetch(
          `/Countries/${countryName}/${tripId}/reviews`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit review.");
        }

        reviewForm.reset();
        errorMessage.textContent = "";
        successMessage.textContent = "Review has been added successfully.";
        successMessage.style.display = "block";

        setTimeout(() => {
          successMessage.style.display = "none";
        }, 4000);

        await loadReviews();
      } catch (err) {
        console.error(err);
        errorMessage.textContent = "There was an error submitting your review.";
      }
    });
  }

  async function reviewEditForm(
    reviewId,
    currentText,
    currentRating,
    currentImage
  ) {
    const editFormContainer = document.getElementById(
      "edit-review-form-container"
    );
    const editDescription = document.getElementById("edit-descr");
    const editRating = document.getElementById("edit-rating");
    const editReviewId = document.getElementById("edit-review-id");
    const currentImageContainer = document.getElementById(
      "current-image-container"
    );
    const deleteImageCheckbox = document.getElementById(
      "delete-image-checkbox"
    );

    editDescription.value = currentText;
    editRating.value = currentRating;
    editReviewId.value = reviewId;

    if (currentImage) {
      currentImageContainer.innerHTML = `
        <p>Current Image:</p>
        <img src="/images/${currentImage}" style="max-width: 200px;" />
      `;
      deleteImageCheckbox.checked = false;
      deleteImageCheckbox.disabled = false;
    } else {
      currentImageContainer.innerHTML = `<p>No image uploaded.</p>`;
      deleteImageCheckbox.checked = false;
      deleteImageCheckbox.disabled = true;
    }

    editFormContainer.style.display = "block";

    const editForm = document.getElementById("edit-review-form");
    const editImageInput = document.getElementById("edit-image");
    editForm.addEventListener(
      "submit",
      async function handleEditSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("text", editDescription.value);
        formData.append("rating", editRating.value);

        const imageFile = editImageInput.files[0];
        const deleteImage = deleteImageCheckbox.checked;

        if (imageFile) {
          formData.append("image", imageFile);
        }

        if (deleteImage) {
          formData.append("deleteImage", "true");
        }

        const reviewIdToUpdate =
          document.getElementById("edit-review-id").value;

        try {
          const response = await fetch(
            `/Countries/${countryName}/${tripId}/reviews/${reviewIdToUpdate}/edit`,
            {
              method: "PUT",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update the review.");
          }

          editForm.reset();
          editFormContainer.style.display = "none";
          await loadReviews();
        } catch (error) {
          console.error("Error updating review:", error);
        }
      },
      { once: true }
    );
  }

  if (toggleReviewsBtn) {
    toggleReviewsBtn.addEventListener("click", async () => {
      if (
        reviewList.style.display === "none" ||
        reviewList.style.display == ""
      ) {
        await loadReviews();
        reviewList.style.display = "block";
        toggleReviewsBtn.textContent = "Hide Reviews";
      } else {
        reviewList.style.display = "none";
        toggleReviewsBtn.textContent = "Show Reviews";
      }
    });
  }

  if (toggleFormBtn) {
    toggleFormBtn.addEventListener("click", () => {
      if (
        reviewFormContainer.style.display === "none" ||
        reviewFormContainer.style.display == ""
      ) {
        reviewFormContainer.style.display = "block";
        toggleFormBtn.textContent = "Hide Review Form";
      } else {
        reviewFormContainer.style.display = "none";
        toggleFormBtn.textContent = "Add Review";
      }
    });
  }
});
