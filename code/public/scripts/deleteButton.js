const mainElement = document.querySelector("main");
const dialog = document.getElementById("confirmDialog");
const closeButton = document.getElementById("cancelDialogButton");
const confirmButton = document.getElementById("confirmDialogButton");

let currentAction = null;

const hideDialogHandler = () => {
  dialog.close();
  currentAction = null;
  confirmButton.removeEventListener("click", confirmDialogHandler);
  closeButton.removeEventListener("click", hideDialogHandler);
};
const confirmDialogHandler = async () => {
  try {
    const response = await fetch(currentAction.url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      if (currentAction.type === "review") {
        if (typeof loadReviews === "function") {
          loadReviews();
        } else {
          location.reload();
        }
      } else {
        location.reload();
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error to send response");
    }
  } catch (error) {
    alert("Server communication error");
  } finally {
    hideDialogHandler();
  }
};

const showConfirmDialog = (event) => {
  event.preventDefault();
  const h4 = dialog.querySelector("h4");
  const username = event.currentTarget.dataset.username;
  const userid = event.currentTarget.dataset.userid;
  const tripid = event.currentTarget.dataset.tripid;
  const triptit = event.currentTarget.dataset.triptit;
  const countryname = event.currentTarget.dataset.countryname;
  const countryId = event.currentTarget.dataset.countid;
  const type = event.currentTarget.dataset.type;
  const reviewId = event.currentTarget.dataset.reviewId;
  const reviewerName = event.currentTarget.dataset.reviewerName;
  const bookId = event.currentTarget.dataset.bookid;
  const bookNumber = event.currentTarget.dataset.booknumber;

  let text = "";
  let url = "";

  if (type === "user") {
    text = `Do you really want to delete user: ${username}?`;
    url = `/admin/user/${userid}/delete`;
  } else if (type === "trip") {
    text = `Do you really want to delete trip: ${triptit}?`;
    url = `/admin/Countries/${countryname}/${tripid}/delete`;
  } else if (type === "country") {
    text = `Do you really want to delete country: ${countryname}?`;
    url = `/admin/Countries/${countryId}/delete`;
  } else if (type === "review") {
    const bodyElement = document.body;
    const countryNameFromBody = bodyElement.dataset.countryName;
    const tripIdFromBody = bodyElement.dataset.tripId;
    text = `Do you really want to delete review by ${reviewerName}?`;
    url = `/Countries/${countryNameFromBody}/${tripIdFromBody}/reviews/${reviewId}/delete`;
  } else if (type === "book") {
    text = `Do you really want to delete booking: ${bookNumber}?`;
    url = `/Book/${bookId}/delete`;
  }

  h4.textContent = text;
  currentAction = { url, type };

  confirmButton.removeEventListener("click", confirmDialogHandler);
  closeButton.removeEventListener("click", hideDialogHandler);

  confirmButton.addEventListener("click", confirmDialogHandler);
  closeButton.addEventListener("click", hideDialogHandler);

  dialog.showModal();
};

window.showConfirmDialog = showConfirmDialog;

document.querySelectorAll(".delete-button").forEach((button) => {
  button.addEventListener("click", showConfirmDialog);
});
