// const hello = "hello world";
// console.log(hello);


// no need index.html anymore, just type node index.js
// so npm is an environment

// this is the sync version, blocking occurs, bad
// every code should wait for the previous one to finish->blocking
TODO: 
// package version number major change.minor change.bug fix
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
// like import fs as fs
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// //this is the async version, non-blocking, good
// // also this is why we use callback: when the code execute the callback func, it 
// // won't wait for the code to execute; instead, it execute the block (usually time-consuming task) in the background,
// // and skips it and moves on the next line of code
// fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
//     if (err) {return console.log("error");}
//     console.log(data);
// }
// );
// console.log("Reading files...");

// // for node-js, it follows non-blocking I/O model
// // node.js has only one single thread, impractical to allow sync executions: A has 
// // to wait for B if B is processing a time-consuming task (e.g., read large data file)
// // so the best way to do this it to run the code behind the scene
// // NOTE THAT: other languages, like php, does it differently

// // callback doesn't entirely mean async!
// // don't have too much callback func in one single block!



// const textOut = `this is what we get from input: ${textIn}.\nCreated on ${Date.now()}`;
// // note that we should use ` instead of '
// // ${} like string + string in java
// fs.writeFileSync('./txt/output.txt', textOut);

// //////////////////////////////////////////
//server
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// turns all the words into lowercases
console.log(slugs);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAMES%}/g, product.productName);
    // json format used in above
    // ...traverse the json obj

    return output;
}

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // res.end("hello from the server");
    // this message will show on the server
    const pathName = req.url;
    const { query, pathname } = url.parse(req.url, true);
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { 'Content-type': "text/html" });
        // NOTE THAT content type here decides the type displayed on server (e.g., json->json file, text->html file)
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
        res.end(output);
    }
    else if (pathname === "/product") {
        res.end("this is the product");
    } else if (pathname === "/api") {
        // fs.readFile(`${__dirname}/dev-data/data.json`,"utf-8",(err,data)=>{
        //    const productData=JSON.parse(data);
        //    res.writeHead(200, {'Content-type':"application/json"});
        //    res.end(data);
        // });
        //we move this callback func outside the createserver callback since it will exectute 
        //every time we create the server
        //we need it to execute only once; so we move it to the head of our code
        res.writeHead(200, { 'Content-type': "application/json" });
        // content type tells users what content they receive from the server
        res.end(data);
    }
    else {
        // if not found, send 404 error code with specific header defined below
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end("<h1>page not found</h1>");
    }
});
// this call back func works each time the user sends an HTTP request
// request-> click the enter button after typing URL
server.listen(8000, '127.0.0.1', () => {
    console.log('listening to requests on port 8000');
});
// this message aims to show that the server starts working
// NOTE THAT the program won't stop; it will keep working 
// port number 8k, local host name