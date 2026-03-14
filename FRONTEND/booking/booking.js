const BASE_URL = "http://localhost:5000";

// Get hotelId from URL
const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const guests = document.getElementById("guests").value;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        hotelId,
        checkIn,
        checkOut,
        guests
      })
    });

    const data = await res.json();

    if (res.ok) {
  alert("Booking request sent. Waiting for admin approval.");
  window.location.href = "../hotellist/hotels.html";
} else {
      alert(data.message);
    }

  } catch (error) {
    console.error(error);
    alert("Booking failed");
  }
});