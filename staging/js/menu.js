document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".floating-hamburger");
  const menu = document.getElementById("slideupMenu");
  const closeBtn = document.getElementById("menuCloseBtn");

  if (hamburger && menu && closeBtn) {
    hamburger.addEventListener("click", () => {
      menu.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }
});
