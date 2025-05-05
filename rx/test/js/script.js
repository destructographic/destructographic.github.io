document.addEventListener("DOMContentLoaded", () => {
  // Optional override via query string, e.g. ?day=Thursday
  const params = new URLSearchParams(window.location.search);
  const queryOverride = params.get("day");

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
  const realDay = dayNames[today.getDay()];
  const currentDay = queryOverride || realDay;

  const pullSchedule = {
    Sunday:    { daysAgo: [13] },
    Monday:    { daysAgo: [13] },
    Tuesday:   { daysAgo: [13] },
    Wednesday: { daysAgo: [13] },
    Thursday:  { daysAgo: [13, 12] },
    Friday:    { daysAgo: [13] },
    Saturday:  { daysAgo: [] }
  };

  const pad = (n) => n.toString().padStart(2, '0');

  function formatDate(dateObj) {
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const year = dateObj.getFullYear();
    return { month, day, year };
  }

  function renderDate(dateObj, blockNum) {
    const { month, day, year } = formatDate(dateObj);
    document.getElementById(`date-top-${blockNum}`).innerHTML = `${month}<span class="slash"> / </span>${day}`;
    document.getElementById(`date-bottom-${blockNum}`).textContent = year;
  }

  function renderUIForDay(dayName) {
    const config = pullSchedule[dayName];
    const instructionEl = document.getElementById("pull-instruction");
    const chevron = document.getElementById("chevron");
    const block1 = document.getElementById("date-block-1");
    const block2 = document.getElementById("date-block-2");
    const bigX = document.getElementById("no-pull-x");
    const icon = bigX.querySelector("svg");

    // Reset state
    block1.classList.add("hidden");
    block2.classList.add("hidden");
    chevron.classList.add("hidden");
    bigX.classList.add("hidden");
    if (icon) icon.classList.remove("wiggle");

    if (config.daysAgo.length === 0) {
      instructionEl.innerHTML = `Today is ${dayName}.<br>No meds pulled today.`;
      bigX.classList.remove("hidden");
      if (icon) icon.classList.add("wiggle");
    } else if (config.daysAgo.length === 1) {
      instructionEl.innerHTML = `Today is ${dayName}.<br>We need to pull meds that were filled on:`;
      const date1 = new Date();
      date1.setDate(date1.getDate() - config.daysAgo[0]);
      renderDate(date1, 1);
      block1.classList.remove("hidden");
    } else if (config.daysAgo.length === 2) {
      instructionEl.innerHTML = `Today is ${dayName}.<br>We need to pull meds that were filled between:`;
      const date1 = new Date();
      const date2 = new Date();
      date1.setDate(date1.getDate() - config.daysAgo[0]);
      date2.setDate(date2.getDate() - config.daysAgo[1]);
      renderDate(date1, 1);
      renderDate(date2, 2);
      block1.classList.remove("hidden");
      block2.classList.remove("hidden");
      chevron.classList.remove("hidden");
    }
  }

  renderUIForDay(currentDay);
});
