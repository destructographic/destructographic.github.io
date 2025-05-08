document.addEventListener("DOMContentLoaded", () => {
  // Fix mobile viewport height issues
  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  window.addEventListener('resize', setViewportHeightVar);
  window.addEventListener('orientationchange', setViewportHeightVar);
  setViewportHeightVar();

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const currentDay = dayNames[today.getDay()];
  document.getElementById("pull-instruction").textContent =
    `Today is ${currentDay}. We need to pull meds that were filled on:`;

  const pullDate = new Date();
  pullDate.setDate(pullDate.getDate() - 13);

  const pad = (n) => n.toString().padStart(2, '0');
  const month = pad(pullDate.getMonth() + 1);
  const day = pad(pullDate.getDate());
  const year = pullDate.getFullYear();

  document.getElementById("date-top").innerHTML = `${month}<span class="slash"> / </span>${day}`;
  document.getElementById("date-bottom").textContent = year;
});
