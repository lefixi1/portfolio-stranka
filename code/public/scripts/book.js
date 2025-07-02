const countrySelectElement = document.getElementById("country");
const tripSelectElement = document.getElementById("trip");

const updateTripsDropdown = async (event) => {
  const countryId = event ? event.target.value : countrySelectElement.value;
  console.log("Country ID:", countryId);
  tripSelectElement.innerHTML = "";

  if (!countryId) {
    const option = document.createElement("option");
    option.textContent = "First choose the country";
    option.disabled = true;
    option.selected = true;
    tripSelectElement.appendChild(option);
    tripSelectElement.disabled = true;
    return;
  }

  try {
    const response = await fetch(`/Book/Trips/${countryId}`);

    if (!response.ok) throw new Error(`HTTP chyba: ${response.status}`);

    const trips = await response.json();

    if (countryId) {
      if (trips.length === 0) {
        const noTripsOption = document.createElement("option");
        noTripsOption.disabled = true;
        noTripsOption.selected = true;
        noTripsOption.textContent = "No trips available for this country";
        tripSelectElement.appendChild(noTripsOption);
        tripSelectElement.disabled = true;
      } else {
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Choose trip";
        tripSelectElement.appendChild(defaultOption);

        for (const t of trips) {
          const option = document.createElement("option");
          option.value = t.trip_id;
          option.textContent = t.trip_tit;
          tripSelectElement.appendChild(option);
        }

        const originalTripId = tripSelectElement.dataset.originalTripId;
        if (originalTripId) {
          const originalTripOption = tripSelectElement.querySelector(
            `option[value="${originalTripId}"]`
          );
          if (originalTripOption) {
            originalTripOption.selected = true;
            delete tripSelectElement.dataset.originalTripId;
          }
        }

        tripSelectElement.disabled = false;
      }
    }
  } catch (error) {
    console.error("Error loading trips:", error);
    alert("There was an error loading the trips, please try again.");

    const errorOption = document.createElement("option");
    errorOption.disabled = true;
    errorOption.selected = true;
    errorOption.textContent = "Chyba pri načítaní tripov";
    tripSelectElement.appendChild(errorOption);
  }
};

countrySelectElement.addEventListener("change", updateTripsDropdown);

if (countrySelectElement.value) {
  updateTripsDropdown();
} else {
  tripSelectElement.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "First choose the country";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  tripSelectElement.appendChild(defaultOption);
  tripSelectElement.disabled = true;
}
