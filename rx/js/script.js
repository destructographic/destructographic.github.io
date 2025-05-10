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

  const pad = (n) => n.toString().padStart(2, '0');

  // Greeting (e.g. Today is Monday, May 13th)
  const today = new Date();
  const dayOfWeek = dayNames[today.getDay()];
  const monthName = monthNames[today.getMonth()];
  const dayOfMonth = today.getDate();
  const suffix = getDateSuffix(dayOfMonth);
  document.getElementById("greeting").textContent =
    `Today is ${dayOfWeek}, ${monthName} ${dayOfMonth}${suffix}.`;

  // PULL date (13 days ago)
  const pullDate = new Date();
  pullDate.setDate(pullDate.getDate() - 13);
  const pullMonth = pad(pullDate.getMonth() + 1);
  const pullDay = pad(pullDate.getDate());
  document.getElementById("date-pull-md").innerHTML =
    `${pullMonth}<span class="slash"> / </span>${pullDay}`;

  // RTS date (14 days ago)
  const rtsDate = new Date();
  rtsDate.setDate(rtsDate.getDate() - 14);
  const rtsMonth = pad(rtsDate.getMonth() + 1);
  const rtsDay = pad(rtsDate.getDate());
  document.getElementById("date-rts-md").innerHTML =
    `${rtsMonth}<span class="slash"> / </span>${rtsDay}`;
});
