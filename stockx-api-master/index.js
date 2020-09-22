const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();



const stockX = new StockXAPI({
    proxy: 'proxyhere',
    currency: 'USD',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
});
 
stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet')
.then(product => console.log(product.variants))
.catch(err => console.log(`Error scraping product details: ${err.message}`));