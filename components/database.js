

//mysql://b63eb6c7cbc057:80e6d349@eu-cdbr-west-03.cleardb.net/heroku_396c69ecedb014e?reconnect=true

//mysql://b2e6df09802738:0620535e@eu-cdbr-west-03.cleardb.net/heroku_7d523e0ac62028f?reconnect=true ->test
const mysql = require('mysql');
const express = require('express');
const router = express.Router();

const db = mysql.createPool({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b2e6df09802738',
    password: '0620535e',
    database: 'heroku_7d523e0ac62028f',
  });
  
router.get('/getTimeRule', (req, res) => {
    db.getConnection((err, con) => {
      if (err) throw err;
      con.query('select * from timerule;', (err, rows) => {
        con.release();
        if (!err) res.send(rows);
        else res.send(err);
      });
    });
  });
  
router.get('/getOrderList', (req, res) => {
    db.getConnection((err, con) => {
      if (err) throw err;
      con.query('select * from orderlist', (err, rows) => {
        con.release();
        if (!err) res.send(rows);
        else console.log(err);
      });
    });
  });
  
  router.post('/insertOrder', (req, res) => {
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
  
  router.post('/insertUser', (req, res) => {
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
  
  router.post('/findUser', (req, res) => {
    const userID = req.body.userID;
    const find =
      `select firstname, lastname, phone, gmail, userID  from userlist where userID = \'${userID}\'`;
    db.query(find, (err, result) => {
      if (!err) res.send(result);
      else res.send([]);
    });
  });
  
  router.post('/getOrderUser', (req, res) => {
    const userId = req.body.userID;
    const find =
      `select orderID, date, hour, checkoutId, paid, eventID, startTime, endTime from orderlist where userID = \'${userId}\' order by date and orderID;`
    db.query(find, (err, result) => {
      if (!err){
        res.send(result);
      }
      else res.send([]);
    });
  });
  
  router.post('/getUserID', (req,res)=>{
    const checkoutId = req.body.checkoutId;
    const find =
      `select userID, date, hour, paid, status from orderlist  where checkoutId = \'${checkoutId}\'`;
    db.query(find, (err, result) => {
      if (!err) res.send(result);
      else res.send([]);
    });
  })
  
  router.post('/updatePayment', (req, res) => {
    const checkoutId = req.body.checkoutId;
    const find =
      `update orderlist set paid=\'paid\' where checkoutId = \'${checkoutId}\'`;
    db.query(find, (err, result) => {
      if (!err) res.send(result);
      else res.send([]);
    });
  });
  
  router.post('/updateEventID', (req, res) => {
    const id = req.body.id;
    const eventStartTime = req.body.start;
    const eventEndTime = req.body.end;
    const checkoutId = req.body.checkoutId;
    const find =
      `update orderlist set eventID=\'${id}\', startTime=\'${eventStartTime}\', endTime=\'${eventEndTime}\' where checkoutId = \'${checkoutId}\'`;
    db.query(find, (err, result) => {
      if (!err) res.send(result);
      else res.send([]);
    });
  });
  
  router.post('/updateCheckoutId', (req, res) => {
    const orderId = req.body.orderId;
    const find =
      `update orderlist set checkoutId=\'${1}\' where orderID = \'${orderId}\'`;
    db.query(find, (err, result) => {
      if (!err) res.send(result);
      else res.send([]);
    });
  });
  
  router.post('/updatePaymentId', (req, res) => {
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

  router.get('/getClass', (req, res) => {
    db.getConnection((err, con) => {
      if (err) throw err;
      con.query('select * from class;', (err, rows) => {
        con.release();
        if (!err) res.send(rows);
        else res.send(err);
      });
    });
  });

  module.exports = router;