document.addEventListener("DOMContentLoaded", () => {
  function pad(n) {
    return n.toString().padStart(2, '0');
  }

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
