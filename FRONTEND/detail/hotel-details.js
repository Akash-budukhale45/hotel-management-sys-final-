// hotel-details.js
// REAL hotel + reviews + sorting + submit review (STRICT LOGIN PROTECTION)

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

const hotelInfo = document.getElementById("hotelInfo");
const reviewsContainer = document.getElementById("reviewsContainer");
const sortSelect = document.getElementById("sortReviews");
const reviewForm = document.getElementById("reviewForm");
const loginMessage = document.getElementById("loginMessage");
const stars = document.querySelectorAll(".star-input span");

let selectedRating = 0;
const BASE_URL = "http://localhost:5000";

// ================= LOGIN CHECK =================
const token = localStorage.getItem("token");

if (!token) {
  // hide form, show message
  reviewForm.style.display = "none";
  loginMessage.style.display = "block";
}

// ================= STAR INPUT =================
stars.forEach((star, idx) => {
  star.addEventListener("click", () => {
    selectedRating = idx + 1;
    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});

// ================= LOAD HOTEL =================
async function loadHotel() {
  if (!hotelId) {
    hotelInfo.innerHTML = "<p>Hotel not found.</p>";
    return;
  }

  const res = await fetch(`${BASE_URL}/api/hotels/${hotelId}`);
  const h = await res.json();

  if (!h || !h.name) {
    hotelInfo.innerHTML = "<p>Failed to load hotel details.</p>";
    return;
  }

  hotelInfo.innerHTML = `
    <h1>${h.name}</h1>
    <div class="meta">${h.location} • ${"★".repeat(h.stars)}</div>
    <div class="rating">Average Rating: ${h.averageRating || 0} / 5</div>
    <p>${h.description}</p>
  `;
}

// ================= LOAD REVIEWS =================
async function loadReviews(sort = "relevant") {
  const res = await fetch(`${BASE_URL}/api/reviews/${hotelId}?sort=${sort}`);
  const list = await res.json();

  reviewsContainer.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  list.forEach(r => {
    reviewsContainer.innerHTML += `
      <div class="review-card">
        <strong>${r.user?.name || "User"}</strong> • ${"★".repeat(r.rating)}
        <p>${r.reviewText}</p>
        <span class="sentiment ${r.sentiment}">
          ${r.sentiment.toUpperCase()}
        </span>
      </div>
    `;
  });
}

// ================= SORT CHANGE =================
sortSelect.addEventListener("change", () => {
  loadReviews(sortSelect.value);
});

// ================= SUBMIT REVIEW (HARD BLOCK) =================
reviewForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔒 FINAL HARD SECURITY CHECK
  if (!token) {
    alert("Please login to submit a review");
    window.location.href = "../userlogin/login.html";
    return;
  }

  const reviewText = document.getElementById("reviewText").value;

  if (!selectedRating) {
    alert("Please select rating");
    return;
  }

  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      hotelId,
      rating: selectedRating,
      reviewText
    })
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message || "Failed to submit review");
    return;
  }

  alert("Review submitted successfully");

  // reset & reload
  reviewForm.reset();
  selectedRating = 0;
  stars.forEach(s => s.classList.remove("active"));
  loadReviews(sortSelect.value);
});

// ================= INIT =================
loadHotel();
loadReviews();
