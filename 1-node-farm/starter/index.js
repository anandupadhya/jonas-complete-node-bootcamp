const fs = require('fs')
const http = require('http')
const url = require('url')

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
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')


const server = http.createServer((req, res) => {
  // console.log(req.url)
  const pathName = req.url

  if (pathName === '/' || pathName === '/overview') {
    res.end('OVERVIEW page')
  } else if (pathName === '/product') {
    res.end('PRODUCT page')
  } else if (pathName === '/api') {
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
    //   // const productData = JSON.parse(data)
    //   // console.log(productData)
    //   res.writeHeader(200, { 'Content-type': 'application/json' })
    //   // res.end(productData)
    //   res.end(data)
    // })
    res.writeHeader(200, { 'Content-type': 'application/json' })
    res.end(data)
  } else {
    res.writeHeader(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    })
    res.end('<h1>Page not found</h1>')
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Server up and running on PORT 8000')
})
