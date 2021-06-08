const http = require('http');
const fs = require('fs');
const url = require('url');



// SERVER
const replaseTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const tempOverview = fs.readFileSync(`N.js/template/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`N.js/template/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`N.js/template/template-product.html`, 'utf-8');


const data = fs.readFileSync(`N.js/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, resp) => {

    const { query, path } = url.parse(req.url, true);
    // const path = req.url;
    console.log(url.parse(req.url, true));
    console.log(`QUERY  ${query.id}`);
    // console.log(dataObj[query.id]);

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