const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const replaseTemplate = require('./modules/replaseTemplate');


// SERVER



const tempOverview = fs.readFileSync(`template/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`template/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`template/template-product.html`, 'utf-8');


const data = fs.readFileSync(`dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const slugs = dataObj.map(el => slugify(el.productName, { lower: true })) // slugify

const server = http.createServer((req, resp) => {

    const { query, path } = url.parse(req.url, true);

    // Overview page
    if (path === '/' || path === '/overview') {
        resp.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaseTemplate(tempCard, el)).join();
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        resp.end(output)

        // Product page
    } else if (path.indexOf('product')) {
        resp.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaseTemplate(tempProduct, product);
        resp.end(output);

        // API
    } else if (path === '/api') {
        resp.writeHead(200, { 'Content-type': 'application/json' });
        resp.end(data);

        // Not found
    } else
        resp.end('<h1>Page not found!</h1>');
});

server.listen(3000, function() {
    console.log('Server is work');
})