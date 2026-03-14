// FRONTEND/userregistration/register.js

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const adminCode = document.getElementById("adminCode").value; // ✅ ADDED

  try {
    const res = await fetch("https://hotel-management-sys-qdkx.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        adminCode   // ✅ ADDED
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please login.");
    window.location.href = "../userlogin/login.html";

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
});