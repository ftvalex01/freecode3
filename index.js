require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Almacenamiento en memoria para las URLs acortadas
let urlDatabase = {};

// Contador para generar URLs cortas
let shortUrlCounter = 1;

// Middleware para parsear el body
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  try {
    new URL(originalUrl); // Intenta crear un objeto URL. Si falla, la URL no es válida.
  } catch (error) {
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
