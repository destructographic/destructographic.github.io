document.addEventListener("DOMContentLoaded", () => {
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

  // Pull Section
  document.getElementById("instructions-pull").innerHTML =
    `We need to <span class="verb-highlight">pull</span> meds that were filled on:`;

  const pullDate = new Date();
  pullDate.setDate(pullDate.getDate() - 13);
  const pad = (n) => n.toString().padStart(2, '0');
  document.getElementById("date-pull-top").innerHTML =
    `${pad(pullDate.getMonth() + 1)}<span class="slash"> / </span>${pad(pullDate.getDate())}`;
  document.getElementById("date-pull-bottom").textContent = pullDate.getFullYear();

  // RTS Section
  document.getElementById("instructions-rts").innerHTML =
    `We need to <span class="verb-highlight">RTS</span> meds that were filled on:`;

  const rtsDate = new Date();
  rtsDate.setDate(rtsDate.getDate() - 14);
  document.getElementById("date-rts-top").innerHTML =
    `${pad(rtsDate.getMonth() + 1)}<span class="slash"> / </span>${pad(rtsDate.getDate())}`;
  document.getElementById("date-rts-bottom").textContent = rtsDate.getFullYear();
});
