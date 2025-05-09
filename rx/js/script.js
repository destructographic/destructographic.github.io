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
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function getDateSuffix(day) {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const today = new Date();
  const dayOfWeek = dayNames[today.getDay()];
  const monthName = monthNames[today.getMonth()];
  const dayOfMonth = today.getDate();
  const suffix = getDateSuffix(dayOfMonth);

  document.getElementById("greeting").textContent =
    `Today is ${dayOfWeek}, ${monthName} ${dayOfMonth}${suffix}.`;

  document.getElementById("instructions").textContent =
    `We need to pull meds that were filled on:`;

  const pullDate = new Date();
  pullDate.setDate(pullDate.getDate() - 13);

  const pad = (n) => n.toString().padStart(2, '0');
  const month = pad(pullDate.getMonth() + 1);
  const day = pad(pullDate.getDate());
  const year = pullDate.getFullYear();

  document.getElementById("date-top").innerHTML = `${month}<span class="slash"> / </span>${day}`;
  document.getElementById("date-bottom").textContent = year;
});
