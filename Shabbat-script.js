(async function checkShabbat() {  
  const geonameId = '295530'; // Be'er Sheva
  try {
    const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameId}&M=on`);
    const data = await response.json();

    const candleLighting = new Date(data.items.find(i => i.category === 'candles').date);
    const havdalah = new Date(data.items.find(i => i.category === 'havdalah').date);
    
    // Use real time (or toggle your test date here if needed)
    const now = new Date();

    // Check if we are currently on the shabbat page (handles subpaths safely)
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
