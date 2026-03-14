// index.js
// Home page logic (clean version)

const BASE_URL = "https://hotel-management-sys-final-ozya.onrender.com/";

document.addEventListener("DOMContentLoaded", () => {

  console.log("Digital Hospitality Home Page Loaded");

  updateNavbar();
  loadHomeTopHotels();

});


// ================= UPDATE NAVBAR =================

function updateNavbar(){

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const nav = document.querySelector(".navbar nav");

  if(!nav) return;

  // USER LOGGED IN
  if(token && user){

    nav.innerHTML = `
      <a href="../homepage/index.html">Home</a>
      <a href="../hotellist/hotels.html">Hotels</a>
      <a href="../user/profile.html">My Profile</a>
    `;

  }

  // USER NOT LOGGED IN
  else{

    nav.innerHTML = `
      <a href="../homepage/index.html">Home</a>
      <a href="../hotellist/hotels.html">Hotels</a>
      <a href="../userlogin/login.html">Login</a>
      <a href="../userregistration/register.html" class="btn">Register</a>
    `;

  }

}


// ================= LOAD TOP HOTELS =================

async function loadHomeTopHotels() {

  const container = document.getElementById("homeTopHotels");

  if (!container) return;

  container.innerHTML = "<p>Loading top rated hotels...</p>";

  try {

    const res = await fetch(`${BASE_URL}/api/hotels/top`);

    const hotels = await res.json();

    container.innerHTML = "";

    if (!Array.isArray(hotels) || hotels.length === 0) {

      container.innerHTML = "<p>No top rated hotels available.</p>";
      return;

    }

    hotels.slice(0, 3).forEach(hotel => {

      const image =
        hotel.images && hotel.images.length
          ? hotel.images[0]
          : "https://via.placeholder.com/400x300?text=Hotel";

      container.innerHTML += `
        <div class="home-hotel-card">

          <img src="${image}" alt="${hotel.name}">

          <div class="info">
            <h3>${hotel.name}</h3>
            <p>${hotel.location}</p>
            <p class="rating">⭐ ${hotel.averageRating || 0} / 5</p>
          </div>

        </div>
      `;

    });

  } catch (error) {

    console.error("Error loading top rated hotels:", error);

    container.innerHTML = "<p>Unable to load data.</p>";

  }

}