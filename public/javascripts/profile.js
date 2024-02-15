document.addEventListener("DOMContentLoaded", function () {
    const profileCard = document.querySelector(".profile-card");
    const animateButton = document.getElementById("animateButton");
  
    animateButton.addEventListener("click", function () {
      gsap.to(profileCard, { opacity: 1, duration: 1 });
    });
  });
  