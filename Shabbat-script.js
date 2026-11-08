(async function checkShabbat() {  
  const geonameId = '295530'; // Be'er Sheva
  try {
    const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameId}&M=on`);
    const data = await response.json();

    const candleLighting = new Date(data.items.find(i => i.category === 'candles').date);
    const havdalah = new Date(data.items.find(i => i.category === 'havdalah').date);
    
    // Use real-time for production (or your test override if testing)
    const now = new Date();

    // Case-insensitive check prevents GitHub Pages uppercase/lowercase bugs
    const currentPath = window.location.pathname.toLowerCase();
    const isShabbatPage = currentPath.includes('shabbat.html');

    if (now >= candleLighting && now <= havdalah) {
      // It's Shabbat — redirect to the Shabbat page ONLY if not already there
      if (!isShabbatPage) {
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = basePath + 'shabbat.html';
      }
    } else {
      // Not Shabbat — redirect back home ONLY if currently stuck on the shabbat page
      if (isShabbatPage) {
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = basePath + 'index.html';
      }
    }
  } catch (err) {
    console.error('Error checking Shabbat status:', err);
  }
})();
