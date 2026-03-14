document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const userNameSpan = document.getElementById("userName");

  // USER LOGGED IN
  if (token) {

    if(loginLink) loginLink.style.display = "none";
    if(registerLink) registerLink.style.display = "none";

    if(userNameSpan){
      userNameSpan.style.display = "inline";
      userNameSpan.textContent = "My Profile";
    }

    // ❌ Navbar logout hide
    if(logoutLink){
      logoutLink.style.display = "none";
    }

  }

  // USER LOGGED OUT
  else {

    if(loginLink) loginLink.style.display = "inline";
    if(registerLink) registerLink.style.display = "inline";

    if(userNameSpan){
      userNameSpan.style.display = "none";
    }

    if(logoutLink){
      logoutLink.style.display = "none";
    }

  }

});