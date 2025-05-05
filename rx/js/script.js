console.log("JS file loaded");

document.addEventListener("DOMContentLoaded", () => {
  // fix mobile viewport height issues
  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  window.addEventListener('resize', setViewportHeightVar);
  window.addEventListener('orientationchange', setViewportHeightVar);
  setViewportHeightVar();

  // pad single digits
  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  // render date 13 days ago
  function renderPastDate() {
    const now = new Date();
    now.setDate(now.getDate() - 13); // subtract 13 days

    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const year = now.getFullYear();

    document.getElementById('date-top').innerHTML = `${month}<span class="slash"> / </span>${day}`;
    document.getElementById('date-bottom').textContent = year;
  }

  // render current day of week in pull-instruction
  function renderDayOfWeek() {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayOfWeek = dayNames[today.getDay()];
    const el = document.getElementById('pull-instruction');
    if (el) {
      el.textContent = `Today is ${dayOfWeek}. We need to pull meds that were filled on:`;
    }
  }

  renderPastDate();
  renderDayOfWeek();
});
