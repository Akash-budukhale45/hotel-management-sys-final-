const BASE_URL = "https://hotel-management-sys-qdkx.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  setupLogout();
});


// ===== LOAD PROFILE =====

async function loadProfile() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    alert("Login required");
    window.location.href = "../userlogin/login.html";
    return;
  }

  // show user info
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileName2").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;

  try {

    const res = await fetch(`${BASE_URL}/api/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const bookings = await res.json();

    const currentBody = document.querySelector("#currentBookings tbody");
    const historyBody = document.querySelector("#historyBookings tbody");

    currentBody.innerHTML = "";
    historyBody.innerHTML = "";

    bookings.forEach(b => {

      const row = `
        <tr>
          <td>${b.hotel?.name || "N/A"}</td>
          <td>${b.checkIn.substring(0,10)}</td>
          <td>${b.checkOut.substring(0,10)}</td>
          <td>${b.status}</td>
        </tr>
      `;

      if (b.status === "Pending") {
        currentBody.innerHTML += row;
      } else {
        historyBody.innerHTML += row;
      }

    });

  } catch (err) {
    console.error("Error loading bookings", err);
  }

}


// ===== LOGOUT =====

function setupLogout(){

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

   window.location.href = "../homepage/index.html";

  });

}