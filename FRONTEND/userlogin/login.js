// FRONTEND/userlogin/login.js

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://hotel-management-sys-final-ozya.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ Save login data
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));  // ⭐ IMPORTANT

    alert("Login successful");

    // ✅ Role based redirect
    if (data.user.role === "admin") {
      window.location.href = "../admin/admin.html";
    } else {
      window.location.href = "../homepage/index.html";
    }

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
});