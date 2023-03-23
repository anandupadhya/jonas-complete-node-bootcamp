const fs = require("fs");
const http = require("http");
const url = require("url");

////////// FILE

// const hello = 'Hello world!'
// console.log(hello)

// // SYNCHRONOUS (blocking) => BAD👎
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textInput)

// const testOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', testOutput)
// console.log('Done writing file!')

// ASYNCHRONOUS (non-blocking) => GOOD👍

// Example 1
// fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
//   console.log(data)
// })
// console.log('Reading text file...')

// // Example 2
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR')
//   console.log(data1)
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2)
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3)
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('File has been written!')
//       })
//     })
//   })
// })
// console.log('Reading text file...')

////////// SERVER //////////

const replaceTemplate = (templateCard, product) => {
  let output = templateCard;

  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  } else {
    output = output.replace(/{%NOT_ORGANIC%}/g, "");
  }
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const products = JSON.parse(data);

const server = http.createServer((req, res) => {
  // console.log(url.parse(req.url, true))
  // const pathname = req.url
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHeader(200, { "Content-type": "text/html" });

    const cardsHtml = products
      .map((product) => replaceTemplate(templateCard, product))
      .join("");
    // console.log(cardsHtml)

    output = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const { id } = query;

    const product = products.filter((product) => product.id == id)[0];
    output = replaceTemplate(templateProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHeader(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHeader(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server up and running on PORT 8000");
});
