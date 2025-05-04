document.addEventListener("DOMContentLoaded", () => {
  // fix mobile viewport height issues (address bar shrink)
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

  // render today's date
  function renderToday() {
    const now = new Date();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const year = now.getFullYear();

    document.getElementById('date-top').innerHTML = `${month}<span class="slash"> / </span>${day}`;
    document.getElementById('date-bottom').textContent = year;
  }

  renderToday();
});
