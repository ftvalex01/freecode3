require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validator = require('validator'); // Asegúrate de instalar este paquete
const app = express();

// Almacenamiento en memoria para las URLs acortadas
let urlDatabase = {};

// Contador para generar URLs cortas
let shortUrlCounter = 1;

// Configuración básica
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.post('/api/shorturl', (req, res) => {
  const { url: originalUrl } = req.body;
  if (!validator.isURL(originalUrl, { require_protocol: true })) {
    return res.status(400).json({ error: 'invalid URL' });
  }

  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url: shortUrl } = req.params;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'No short URL found for the given input' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
