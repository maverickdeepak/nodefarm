const fs = require("fs");
const http = require("http");
const url = require("url");

// Blocking, Synchronous Way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is all about I know Avacado. ${textIn}. The created time is ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// Non Blocking Async Way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NURTIENTSNAME%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // NOT Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("Page not found 404!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
