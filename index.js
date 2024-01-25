require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Almacenamiento en memoria para las URLs acortadas
let urlDatabase = {};

// Contador para generar URLs cortas
let shortUrlCounter = 1;

// Middleware para parsear el body
app.use(express.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
