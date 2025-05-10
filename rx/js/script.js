document.addEventListener("DOMContentLoaded", () => {
  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener('resize', setViewportHeightVar);
  window.addEventListener('orientationchange', setViewportHeightVar);
  setViewportHeightVar();

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  function getSuffix(d) {
    if (d>=11&&d<=13) return "th";
    switch(d%10){case1:return"st";case2:return"nd";case3:return"rd";default:return"th";}
  }
  const today = new Date();
  const dow = dayNames[today.getDay()];
  const mon = monthNames[today.getMonth()];
  const dom = today.getDate();
  const suf = getSuffix(dom);
  document.getElementById("greeting").textContent = `Today is ${dow}, ${mon} ${dom}${suf}.`;

  const pad = n=>n.toString().padStart(2,'0');

  const pd = new Date();
  pd.setDate(pd.getDate()-13);
  document.getElementById("date-pull-md").innerHTML =
    `${pad(pd.getMonth()+1)}<span class="slash"> / </span>${pad(pd.getDate())}`;

  const rd = new Date();
  rd.setDate(rd.getDate()-14);
  document.getElementById("date-rts-md").innerHTML =
    `${pad(rd.getMonth()+1)}<span class="slash"> / </span>${pad(rd.getDate())}`;
});
