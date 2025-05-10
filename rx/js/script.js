document.addEventListener("DOMContentLoaded", () => {
  // mobile vh fix
  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener('resize', setViewportHeightVar);
  window.addEventListener('orientationchange', setViewportHeightVar);
  setViewportHeightVar();

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function getSuffix(d) {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // Greeting
  const today = new Date();
  const dow = dayNames[today.getDay()];
  const monName = monthNames[today.getMonth()];
  const dayOfMonth = today.getDate();
  const suffix = getSuffix(dayOfMonth);
  document.getElementById("greeting").textContent =
    `Today is ${dow}, ${monName} ${dayOfMonth}${suffix}.`;

  const pad = (n) => String(n).padStart(2, '0');

  // Pull date (13 days ago)
  const pullDate = new Date();
  pullDate.setDate(pullDate.getDate() - 13);
  const pullMM = pad(pullDate.getMonth()+1);
  const pullDD = pad(pullDate.getDate());
  document.getElementById("date-pull-md").innerHTML =
    `${pullMM}<span class="slash"> / </span>${pullDD}`;

  // RTS date (14 days ago)
  const rtsDate = new Date();
  rtsDate.setDate(rtsDate.getDate() - 14);
  const rtsMM = pad(rtsDate.getMonth()+1);
  const rtsDD = pad(rtsDate.getDate());
  document.getElementById("date-rts-md").innerHTML =
    `${rtsMM}<span class="slash"> / </span>${rtsDD}`;
});
