const BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", loadBookings);

async function loadBookings() {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Admin login required");
    window.location.href = "../userlogin/login.html";
    return;
  }

  try {

    const res = await fetch(`${BASE_URL}/api/bookings`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load bookings");
    }

    const bookings = await res.json();

    const tableBody = document.querySelector("#bookingTable tbody");
    tableBody.innerHTML = "";

    bookings.forEach(booking => {

      const row = `
      <tr>

        <td>${booking.user?.name || "N/A"}</td>

        <td>${booking.hotel?.name || "N/A"}</td>

        <td>${booking.checkIn.substring(0,10)}</td>

        <td>${booking.checkOut.substring(0,10)}</td>

        <td>${booking.guests}</td>

        <td>₹${booking.totalPrice}</td>

        <td>

          <select onchange="updateStatus('${booking._id}', this.value)">

            <option value="Pending" ${booking.status==="Pending"?"selected":""}>Pending</option>

            <option value="Confirmed" ${booking.status==="Confirmed"?"selected":""}>Confirmed</option>

            <option value="Cancelled" ${booking.status==="Cancelled"?"selected":""}>Cancelled</option>

          </select>

        </td>

        <td>

          <button onclick="deleteBooking('${booking._id}')">
            Delete
          </button>

        </td>

      </tr>
      `;

      tableBody.innerHTML += row;

    });

  } catch (error) {

    console.error(error);
    alert("Error loading bookings");

  }

}

async function updateStatus(id, status) {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      throw new Error("Failed to update status");
    }

    alert("Booking status updated");

    loadBookings();

  } catch (error) {

    console.error(error);
    alert("Error updating booking status");

  }

}

async function deleteBooking(id) {

  const token = localStorage.getItem("token");

  const confirmDelete = confirm("Are you sure you want to delete this booking?");

  if (!confirmDelete) return;

  try {

    const res = await fetch(`${BASE_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to delete booking");
    }

    alert("Booking deleted successfully");

    loadBookings();

  } catch (error) {

    console.error(error);
    alert("Error deleting booking");

  }

}