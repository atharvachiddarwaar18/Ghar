import http from 'http';

http.get('http://localhost:5001/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.success && Array.isArray(parsed.products) && parsed.products.length > 0) {
        console.log('✅ TEST PASSED: Database is successfully working and returning products.');
        console.log(`Got ${parsed.products.length} products.`);
      } else {
        console.log('❌ TEST FAILED: Response was not as expected.', parsed);
      }
    } catch(e) {
      console.log('❌ TEST FAILED: Failed to parse JSON.', data);
    }
  });
}).on('error', err => {
  console.log('❌ TEST FAILED: Server not reachable.', err.message);
});
