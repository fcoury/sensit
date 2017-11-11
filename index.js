const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const app = express();

const { Client, Pool } = require('pg');
const pool = new Pool();

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const data = [];

app.post('/reset', (req, res) => {
  data.splice(0, data.length);
  res.json({ ok: true });
});

app.post('/', (req, res) => {
  const entry = { timestamp: new Date(), ...req.body };
  pool.connect((err, client, done) => {
    const query = 'INSERT INTO entries (timestamp, humidity, temperature) RETURNING *';
    const values = [new Date(), req.body.humidity, req.body.temperature];
    client.query(query, values, (error, res) => {
      done();
      if (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error });
      }
      res.json({ ok: true, ...res[0] });
    })
  });
});

const getData = (callback) => {
  pool.connect((err, client, done) => {
    const query = `
      SELECT
        timestamp, humidity, temperature
      FROM
        entries
      ORDER BY
        timestamp DESC
      LIMIT 120`;
    client.query(query, [], (error, r) => {
      done();
      callback(error, r);
    });
  });
};

app.get('/', (req, res) => {
  getData((error, r) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ ok: false, error });
    }
    console.log('res.rows', r.rows);
    const lastData = r.rows[0];
    if (lastData) {
      const { timestamp, temperature, humidity } = lastData;
      const data = r.rows.reverse();
      res.render('index', { timestamp, temperature, humidity, data });
    } else {
      res.render('index', { timestamp: null, temperature: null, humidity: null, data: [] });
    }
  });
});

app.get('/data', (req, res) => {
  getData((error, r) => {
    res.json(r.rows);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
