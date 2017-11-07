const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const data = [
    {
        "humidity": 59,
        "temperature": 24,
        "timestamp": "2017-11-07T00:42:23.017Z"
    },
    {
        "humidity": 62,
        "temperature": 23,
        "timestamp": "2017-11-07T00:48:41.793Z"
    },
    {
        "humidity": 62,
        "temperature": 23,
        "timestamp": "2017-11-07T00:49:33.969Z"
    },
    {
        "humidity": 61,
        "temperature": 23,
        "timestamp": "2017-11-07T00:50:36.304Z"
    },
    {
        "humidity": 60,
        "temperature": 23,
        "timestamp": "2017-11-07T00:52:44.743Z"
    },
    {
        "humidity": 59,
        "temperature": 23,
        "timestamp": "2017-11-07T00:53:47.009Z"
    },
    {
        "humidity": 59,
        "temperature": 23,
        "timestamp": "2017-11-07T00:54:49.427Z"
    },
    {
        "humidity": 59,
        "temperature": 23,
        "timestamp": "2017-11-07T00:55:51.792Z"
    },
    {
        "humidity": 60,
        "temperature": 23,
        "timestamp": "2017-11-07T00:56:54.079Z"
    },
    {
        "humidity": 59,
        "temperature": 23,
        "timestamp": "2017-11-07T00:57:56.387Z"
    }
];

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
