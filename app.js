const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'amitadatabase',
});

app.get('/get', (req, res) => {
  db.getConnection((err, con) => {
    if (err) throw err;
    console.log(con.threadId);
    con.query('select * from dummy', (err, rows) => {
      con.release();
      if (!err) res.send(rows);
      else console.log(err);
    });
  });
});

app.get('/getTimeRule', (req, res) => {
  db.getConnection((err, con) => {
    if (err) throw err;
    console.log(con.threadId);
    con.query('select * from timerule', (err, rows) => {
      con.release();
      if (!err) res.send(rows);
      else console.log(err);
    });
  });
});

app.get('/getOrderList', (req, res) => {
  db.getConnection((err, con) => {
    if (err) throw err;
    console.log(con.threadId);
    con.query('select * from orderlist', (err, rows) => {
      con.release();
      if (!err) res.send(rows);
      else console.log(err);
    });
  });
});

app.post('/insertOrder', (req, res) => {
  const userId = 'test1234';
  const date = req.body.date;
  const orderDate = new Date();
  const status = 'order';
  console.log(date);
  const sqlInsert =
    'insert into orderlist (userID, date, OrderDate, status) values (?,?,?,?)';
  db.query(
    sqlInsert,
    [userId, date, orderDate, status],
    (err, result) => console.log('test', err)
  );
});

app.post('/findDate', (req, res) => {
  const date = req.body.date;
  const find =
    'select date from orderlist where date = ' + mysql.escape(date);
  db.query(find, (err, result) => {
    if (!err && result?.length > 0) res.send('true');
    else res.send('false');
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
