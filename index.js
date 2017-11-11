const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const app = express();

const { Client, Pool } = require('pg');

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
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: true,
  });

  const entry = req.body;
  client.connect((error, _client) => {
    if (error) {
      console.error('Error on connect', error);
      return res.status(500).json({ ok: false, error });
    }

    const query = 'INSERT INTO entries (humidity, temperature) VALUES ($1, $2) RETURNING *';
    const values = [req.body.humidity, req.body.temperature];
    client.query(query, values, (error, r) => {
      client.end();
      if (error) {
        console.error('Error on insert', error);
        return res.status(500).json({ ok: false, error });
      }
      res.json({ ok: true, ...r.rows[0] });
    })
  });
});

const getData = (params, callback) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: true,
  });

  client.connect((error, client, done) => {
    if (error) {
      console.error(error);
      return callback(error, null);
    }

    const query = `
      SELECT
        timestamp, humidity, temperature
      FROM
        entries
      ORDER BY
        timestamp DESC
      LIMIT ${params.limit || 60}`;
    client.query(query, [], (error, r) => {
      client.end();
      callback(error, r);
    });
  });
};

app.get('/', (req, res) => {
  getData(req.query, (error, r) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ ok: false, error });
    }
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
  getData(req.query, (error, r) => {
    res.json(r.rows);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
