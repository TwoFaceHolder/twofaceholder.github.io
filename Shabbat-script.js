(async function checkShabbat() {  
  const geonameId = '295530'; // Be'er Sheva
  try {
    const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameId}&M=on`);
    const data = await response.json();

    const candleLighting = new Date(data.items.find(i => i.category === 'candles').date);
    const havdalah = new Date(data.items.find(i => i.category === 'havdalah').date);
  //const now = new Date();
    const now = new Date(candleLighting.getTime() + (18 * 60 * 60 * 1000)); // Saturday morning
    const isShabbatPage = window.location.pathname.includes('shabbat.html');

    if (now >= candleLighting && now <= havdalah) {
      // It's Shabbat — redirect to the Shabbat page if not already there
      if (!isShabbatPage) {
        // Automatically grabs the repository folder prefix (e.g., /shabbat/)
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = basePath + 'shabbat.html';
      }
    } else {
      // Not Shabbat — if visitor is on shabbat.html, redirect back home
      if (isShabbatPage) {
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = basePath + 'index.html';
      }
    }
  } catch (err) {
    console.error('Error checking Shabbat status:', err);
  }
})();
