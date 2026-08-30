const express = require('express');
const path = require('path');

const app = express();
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT) || 4173;

app.use(express.static(root, { extensions: ['html'] }));

app.get('/blog/:slug/', (request, response) => {
  response.sendFile(path.join(root, 'blog', 'post.html'));
});

app.get('/blog/:slug', (request, response) => {
  response.redirect(301, `/blog/${encodeURIComponent(request.params.slug)}/`);
});
app.listen(port, '127.0.0.1', () => {
  console.log(`Ricreations local site: http://127.0.0.1:${port}/`);
});
