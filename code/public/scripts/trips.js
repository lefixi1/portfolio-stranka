const changeOrderButton = document.getElementById("btn-order");
const orderInput = document.getElementById("order");
const orderForm = document.getElementById("order-form");
const countryName = document.body.dataset.countryName;
const tripsContainer = document.querySelector(".card-container");

const changeOrder = async (event) => {
  event.preventDefault();

  if (orderInput.value === "asc") {
    orderInput.value = "desc";
  } else {
    orderInput.value = "asc";
  }

  try {
    const response = await fetch(
      `/Countries/${countryName}?order=${orderInput.value}`
    );

    if (!response.ok) {
      alert("Failed to fetch the updated trips");
      console.error("Error occurred:", error);
    }

    const html = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const newContent = tempDiv.querySelector(".card-container");

    if (newContent) {
      tripsContainer.innerHTML = newContent.innerHTML;
    } else {
      alert("Failed to fetch the updated trips");
      console.error("Error occurred:", error);
    }
  } catch (error) {
    alert("Failed to fetch the updated trips");
    console.error("Error occurred:", error);
  }
};

changeOrderButton.addEventListener("click", changeOrder);
