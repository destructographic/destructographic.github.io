document.addEventListener("DOMContentLoaded", () => {
  console.log("menu.js loaded");

  const hamburger = document.querySelector(".floating-hamburger");
  const menu = document.getElementById("slideupMenu");
  const closeBtn = document.getElementById("menuCloseBtn");

  console.log("hamburger:", hamburger);
  console.log("menu:", menu);
  console.log("closeBtn:", closeBtn);

  if (hamburger && menu && closeBtn) {
    hamburger.addEventListener("click", () => {
      console.log("hamburger clicked");
      menu.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      console.log("close button clicked");
      menu.classList.remove("active");
    });
  } else {
    console.warn("One or more menu elements not found in DOM.");
  }
});
