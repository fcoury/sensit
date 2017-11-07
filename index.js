const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const data = [{
  timestamp: "2017-11-07T12:13:06.554Z",
  temperature: 22,
  humidity: 72
}, {
  timestamp: "2017-11-07T12:33:06.554Z",
  temperature: 21,
  humidity: 68
}];

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
  const lastData = data[data.length-1];
  const { timestamp, temperature, humidity } = lastData;
  res.render('index', { timestamp, temperature, humidity, data });
});

app.get('/data', (req, res) => {
  res.json(data);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
