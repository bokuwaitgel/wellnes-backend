const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const {google} = require('googleapis');
const GOOGLE_CLIENT_ID = '895950892526-teg3cd13d40nvlrigl71l89cjo79nep5.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRED = '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'
const REFRESH_TOKEN = '1//04SUbdzAjPsEyCgYIARAAGAQSNwF-L9Ir12m4kMqcKuJC3efVeqx_qCBzcf7qpRaxN9i8sl91Zqa85KK9xhl1w6Bv-WpJqfr-GqI'
const calendarID = 'e0ae2d8eec5705fb51d423292b9db0a6e56fb8eeb6d5be17430f090ca70011ab@group.calendar.google.com'

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRED,
  'http://localhost:4000'
)

oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const calendar = google.calendar('v3')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());

//mysql://b63eb6c7cbc057:80e6d349@eu-cdbr-west-03.cleardb.net/heroku_396c69ecedb014e?reconnect=true
const db = mysql.createPool({
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
    `select firstname, lastname, phone, gmail, userID  from userlist where userID = \'${userID}\'`;
  db.query(find, (err, result) => {
    if (!err) res.send(result);
    else res.send([]);
  });
});

app.post('/getOrderUser', (req, res) => {
  const userId = req.body.userID;
  const find =
    `select orderID, date, hour, checkoutId, paid, eventID from orderlist where userID = \'${userId}\' order by date and orderID;`
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

app.post('/updateEventID', (req, res) => {
  const id = req.body.id;
  const checkoutId = req.body.checkoutId;
  const find =
    `update orderlist set eventID=\'${id}\' where checkoutId = \'${checkoutId}\'`;
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

app.post('/addGoogleCalender', async (req, res, next) => {
  const eventStartTime = req.body.start;
  const eventEndTime = req.body.end;
  const summary = req.body.summary;
  const description = req.body.description;
  try{
    oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: calendarID,
      requestBody: {
        summary: summary,
        description: description,
        colorId: 7,
        start: {
          dateTime: eventStartTime,
        },
        end: {
          dateTime: eventEndTime,
        }
      }
    })
    res.send(response)
  }catch(error){
    next(error)
  }
})

app.post('/getGoogleTime', async (req,res,next) => {
  const eventStartTime = req.body.start;
  const eventEndTime = req.body.end;
  try{
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: calendarID,
      timeMin: (eventStartTime),
      timeMax: (eventEndTime),
    })
    const items = response['data']['items']
    res.send(items)
  }catch(error){
    next(error)
  }
})
app.get('/updateEvent', async (req,res,next) => {
  //const id = req.body.id
  const id = 'e4e4h4sqi1p46h90ej7l9h4vfs'
  try{
    const response = await calendar.events.update({
      auth: oauth2Client,
      calendarId: calendarID,
      eventId: id,
      resource: {
        colorId: 2
      }
    })
    res.send(response)
  }catch(error){
    next(error)
  }
})


app.listen(port, () => console.log(`Listening on port ${port}`));
