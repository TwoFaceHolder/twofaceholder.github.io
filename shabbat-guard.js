(function () {
  "use strict";
  const GEONAME_ID = "295530";      // Be'er Sheva - change to your city if you like
  const CACHE_KEY = "shabbatTimes";
  const FAILSAFE_MS = 3000;         // reveal page if the check hangs

  const TEST_NOW = null;
 // const TEST_NOW = new Date("2026-11-14T10:00:00+02:00"); // pretends it's Shabbat

  const onShabbatPage = /shabbat\.html$/i.test(location.pathname);
  const basePath = location.pathname.replace(/[^/]*$/, "");
  const target = onShabbatPage ? basePath : basePath + "shabbat.html";

  // Hide the page until we know which page should be shown (prevents flicker)
  const root = document.documentElement;
  root.style.visibility = "hidden";
  const reveal = () => { root.style.visibility = ""; };
  const failsafe = setTimeout(reveal, FAILSAFE_MS);

  function getNow() {
    return TEST_NOW ? new Date(TEST_NOW.getTime()) : new Date();
  }

  function readCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!raw) return null;
      const times = {
        candles: new Date(raw.candles),
        havdalah: new Date(raw.havdalah)
      };
      // Cache is only useful until this Shabbat has ended
      return times.havdalah > getNow() ? times : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(times) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        candles: times.candles.toISOString(),
        havdalah: times.havdalah.toISOString()
      }));
    } catch (e) { /* storage unavailable - fine */ }
  }

  async function fetchTimes() {
    const res = await fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=" + GEONAME_ID + "&M=on"
    );
    if (!res.ok) throw new Error("Hebcal request failed: " + res.status);
    const data = await res.json();
    const candles = data.items.find(i => i.category === "candles");
    const havdalah = data.items.find(i => i.category === "havdalah");
    if (!candles || !havdalah) throw new Error("Missing candles/havdalah");
    return { candles: new Date(candles.date), havdalah: new Date(havdalah.date) };
  }

  function decide(times) {
    const now = getNow();
    const isShabbat = now >= times.candles && now <= times.havdalah;

    // Wrong page? Go to the right one. replace() keeps the back button clean.
    if (isShabbat && !onShabbatPage) {
      location.replace(target);
    } else if (!isShabbat && onShabbatPage) {
      location.replace(target);
    } else {
      clearTimeout(failsafe);
      reveal();
    }
  }

  (async function run() {
    let times = readCache();
    if (times) {
      decide(times);
      return;
    }
    try {
      times = await fetchTimes();
      writeCache(times);
      decide(times);
    } catch (err) {
      console.error("Shabbat check failed:", err);
      // On error: never trap anyone on the Shabbat page
      if (onShabbatPage) {
        location.replace(basePath);
      } else {
        clearTimeout(failsafe);
        reveal();
      }
    }
  })();
})();
