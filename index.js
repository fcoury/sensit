const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const data = [];

app.post('/reset', (req, res) => {
  data.splice(0, data.length);
  res.json({ ok: true });
});

app.post('/', (req, res) => {
  const entry = { timestamp: new Date(), ...req.body };
  data.push(entry);
  res.json({ ok: true, entry });
});

app.get('/', (req, res) => {
  res.json(data);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
