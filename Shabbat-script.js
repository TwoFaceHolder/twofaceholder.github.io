<script>
(async function checkShabbat() {  
  const geonameId = '295530'; // Be'er Sheva

  try {
    const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameId}&M=on`);
    const data = await response.json();

    const candleLighting = new Date(data.items.find(i => i.category === 'candles').date);
    const havdalah = new Date(data.items.find(i => i.category === 'havdalah').date);
    //const now = new Date();
    const now = new Date('2026-11-13T18:00:00');

    if (now >= candleLighting && now <= havdalah) {
      // It's Shabbat — redirect to the Shabbat page
      if (!window.location.pathname.endsWith('shabbat.html')) {
        window.location.href = 'shabbat.html';
      }
    } else {
      // Not Shabbat — if visitor manually lands on shabbat.html, redirect back home
      if (window.location.pathname.endsWith('shabbat.html')) {
        window.location.href = '/';
      }
    }
  } catch (err) {
    console.error('Error checking Shabbat status:', err);
  }
})();
</script>
