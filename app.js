const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());
//mysql://b63eb6c7cbc057:80e6d349@eu-cdbr-west-03.cleardb.net/heroku_396c69ecedb014e?reconnect=true
//mysql://b63eb6c7cbc057:80e6d349@eu-cdbr-west-03.cleardb.net/heroku_396c69ecedb014e?reconnect=true
const db = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b63eb6c7cbc057',
  password: '80e6d349',
  database: 'heroku_396c69ecedb014e',
});

app.get('/get', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    res.send("Connected!");
  });
});

app.get('/getTimeRule', (req, res) => {
  db.getConnection((err, con) => {
    if (err) throw err;
    con.query('select * from timerule;', (err, rows) => {
      con.release();
      if (!err) res.send(rows);
      else res.send(err);
    });
  });
});

app.get('/getOrderList', (req, res) => {
  db.getConnection((err, con) => {
    if (err) throw err;
    con.query('select * from orderlist', (err, rows) => {
      con.release();
      if (!err) res.send(rows);
      else console.log(err);
    });
  });
});

app.post('/insertOrder', (req, res) => {
  const userId = req.body.userId;
  const date = req.body.date;
  const hour = req.body.hour;
  const orderDate = new Date();
  const status = req.body.status;
  const checkoutId = req.body.checkoutId;
  const sqlInsert =
    'INSERT INTO `orderlist` (`userID`, `date`, `hour`, `checkoutId`, `status`, `orderDate`) VALUES(?,?,?,?,?,?)';
  db.query(
    sqlInsert,
    [userId, date, hour, checkoutId, status, orderDate],
    (err, result) =>  {
      if (!err) res.send('successful')
      else console.log(err)
    }
  );
});
app.post('/insertUser', (req, res) => {
  const userId = req.body.userID;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const gmail = req.body.gmail;
  const sqlInsert =
    'INSERT INTO `userlist` (`userID`, `firstname`, `lastname`, `phone`, `gmail`) VALUES(?,?,?,?,?)';
  db.query(
    sqlInsert,
    [userId, firstname, lastname, phone, gmail],
    (err, result) =>  {
      if (!err) res.send('successful')
      else console.log(err)
    }
  );
});

app.post('/findDate', (req, res) => {
  const date = req.body.date;
  const find =
    `select date, hour from orderlist where date = \'${date}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});
app.post('/findUser', (req, res) => {
  const userID = req.body.userID;
  const find =
    `select firstname, lastname, phone, gmail, userID  from orderlist where userID = \'${userID}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});

app.post('/getOrderUser', (req, res) => {
  const userId = req.body.userID;
  const find =
    `select orderID, date, hour, checkoutId, paid from orderlist where userID = \'${userId}\' order by date and orderID;`
  db.query(find, (err, result) => {
    if (!err){
      res.send(result);
    }
    else res.send([]);
  });
});

app.post('/cancel', (req, res) => {
  const date = req.body.date;
  const hour = req.body.hour;
  const find =
    `delete from orderlist where date = \'${date}\' and hour = \'${hour}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});

app.post('/updatePayment', (req, res) => {
  const orderId = req.body.checkoutId;
  const find =
    `update orderlist set paid=\'${1}\' where checkoutId = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});

app.post('/updateCheckoutId', (req, res) => {
  const orderId = req.body.orderId;
  const find =
    `update orderlist set checkoutId=\'${1}\' where orderID = \'${orderId}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});

app.post('/updatePaymentId', (req, res) => {
  const checkoutId = req.body.checkoutId;
  const payment = req.body.payment;
  const paid = req.body.paid;
  const find =
    `update orderlist set payment=\'${payment}\', paid=\'${paid}\' where checkoutId = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send(err);
  });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
