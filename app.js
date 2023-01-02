const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');
const Pool = require('pg').Pool;

const { google } = require('googleapis');
const { response } = require('express');
const GOOGLE_CLIENT_ID =
  '378382094535-nkiagmh7esjcuidclb7625lur4d2b2uc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRED = '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';
const REFRESH_TOKEN =
  '1//04UVZyxbMT6wfCgYIARAAGAQSNwF-L9Iriu2J44C_SQf99bmwtQMH9Mjjz3XZ3lOH-xzZ7WomJ-Q9nJ9Vyr_csNJLcb-jgkBN1no';
const calendarID = 'amurang123@gmail.com';

//378382094535-nkiagmh7esjcuidclb7625lur4d2b2uc.apps.googleusercontent.com  -> client id
//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  -> client secret

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRED,
  'https://amita-api.hps.com/'
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const calendar = google.calendar('v3');

require('dotenv').config();

const app = express();
app.use(express.json());
//app.use(cors({
//  origin: '*'
//}));

const port = process.env.PORT || 4000;
app.post('/webhook', (req, res) => {
  console.log('received webhook', req.body);
  res.sendStatus(200);
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());

//DNS -> whispering-cove-ea3bvuruapl278e28a8tq6qm.herokudns.com

//mysql://b63eb6c7cbc057:80e6d349@eu-cdbr-west-03.cleardb.net/heroku_396c69ecedb014e?reconnect=true

const db = new Pool({
  user: 'amita',
  password: 'Amita123#',
  database: 'amitadb',
  host: '127.0.0.1',
  port: 5432,
});
const getTimeRule = (request, response) => {
  db.query('select * from timerule', (err, res) => {
    if (err) throw err;
    response.status(200).json(res.rows);
  });
};
const getOrderList = (request, response) => {
  db.query('select * from orderlist', (err, res) => {
    if (err) throw err;
    response.status(200).json(res.rows);
  });
};

app.get('/getTimeRule', getTimeRule);

app.get('/getOrderList', (req, response) => {
  db.query('select * from orderlist', (err, res) => {
    if (err) throw err;
    response.status(200).json(res.rows);
  });
});

app.post('/insertOrder', (req, response) => {
  const userId = req.body.userId;
  const date = req.body.date;
  const hour = req.body.hour;
  const orderDate = new Date();
  const orderDateS =
    orderDate.getFullYear() +
    '-' +
    orderDate.getMonth() +
    '-' +
    orderDate.getDay() +
    ' ' +
    orderDate.getHours() +
    ':' +
    orderDate.getMinutes() +
    ':' +
    orderDate.getSeconds();

  const status = req.body.status;
  const checkoutId = req.body.checkoutId;
  const sqlInsert = `INSERT INTO orderlist ("userID", date, hour, "checkoutId", status, "orderDate") VALUES( \'${userId}\', \'${date}\', \'${hour}\', \'${checkoutId}\', \'${status}\', NOW())`;
  db.query(sqlInsert, (err, res) => {
    if (err) console.log(err);
    response.status(200).json(res.rows);
  });
});

app.post('/insertUser', (req, response) => {
  const userId = req.body.userID;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const gmail = req.body.gmail;
  const sqlInsert =
    'INSERT INTO userlist ("userID", firstname, lastname,phone, gmail) VALUES($1,$2,$3,$4,$5)';
  db.query(
    sqlInsert,
    [userId, firstname, lastname, phone, gmail],
    (err, result) => {
      if (err) console.log(err);
      response.status(200).json(result);
    }
  );
});

app.post('/findUser', (req, response) => {
  const userID = req.body.userID;
  const find = `select * from userlist where "userID" = \'${userID}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json(result.rows);
  });
});

app.post('/getOrderUser', (req, response) => {
  const userId = req.body.userID;
  const find = `select * from orderlist where "userID" = \'${userId}\' order by date, "orderID";`;
  // const find = `select * from userlist where "userID" = \'${userId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json(result.rows);
  });
});

app.post('/getUserID', (req, response) => {
  const checkoutId = req.body.checkoutId;
  const find = `select "userID", date, hour, paid from orderlist where "checkoutId" = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json(result.rows);
  });
});

app.post('/updatePayment', (req, response) => {
  const checkoutId = req.body.checkoutId;
  const find = `update orderlist set paid=\'paid\' where "checkoutId" = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json([]);
  });
});

app.post('/updateEventID', (req, response) => {
  const id = req.body.id;
  const eventStartTime = req.body.start;
  const eventEndTime = req.body.end;
  const checkoutId = req.body.checkoutId;
  const find = `update orderlist set "eventID"=\'${id}\', "startTime"=\'${eventStartTime}\', "endTime"=\'${eventEndTime}\' where "checkoutId" = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json([]);
  });
});

app.post('/updateCheckoutId', (req, response) => {
  const orderId = req.body.orderId;
  const find = `update orderlist set "checkoutId"=\'${1}\' where "orderID" = \'${orderId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json([]);
  });
});

app.post('/updatePaymentId', (req, response) => {
  const checkoutId = req.body.checkoutId;
  const payment = req.body.payment;
  const paid = req.body.paid;
  const find = `update orderlist set payment=\'${payment}\', paid=\'${paid}\' where "checkoutId" = \'${checkoutId}\'`;
  db.query(find, (err, result) => {
    if (err) throw err;
    response.status(200).json([]);
  });
});

//google calendar

app.post('/addGoogleCalender', async (req, res, next) => {
  const eventStartTime = req.body.start;
  const eventEndTime = req.body.end;
  const summary = req.body.summary;
  const description = req.body.description;
  try {
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: calendarID,
      requestBody: {
        summary: summary,
        description: description,
        colorId: 9,
        start: {
          dateTime: eventStartTime,
          timeZone: 'Asia/Ulaanbaatar',
        },
        end: {
          dateTime: eventEndTime,
          timeZone: 'Asia/Ulaanbaatar',
        },
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.post('/getGoogleTime', async (req, res, next) => {
  const eventStartTime = req.body.start;
  const eventEndTime = req.body.end;
  try {
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: calendarID,
      timeMin: eventStartTime,
      timeMax: eventEndTime,
    });
    const items = response['data']['items'];
    res.send(items);
  } catch (error) {
    next(error);
  }
});
const stsBase = 'https://chp.hipay.mn';
const client_secret = '5hPR4fs9g2Wq5ZAXWI0L2L';
const client_id = 'amitawlc';
// const client_secret = 'Trk4UNHt58LqDwRL4adsXV'
// const client_id = 'amita001';
const bearer = 'Bearer ' + client_secret;

app.post('/getToken', async (req, res, next) => {
  const code = req.body.code;
  data = {
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: 'xx',
    code: code,
    grant_type: 'authorization_code',
  };
  const response = await axios.post(stsBase + '/v2/auth/token', data);
  const result = response.data;
  res.send(result);
});

app.post('/getUserInfo', async (req, res, next) => {
  const token = req.body.token;
  //const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBOUJENzBCMDc5OEE3NUY3RTA1MzJBNjRBOEMwOUIzQiIsImlzcyI6ImFtaXRhMDAxIiwicmZ0IjoiRUExOEZDOTMxMzgzMjEyQUUwNTMyQTY1QThDMEJDMDkiLCJleHAiOjE2NjQ3Njc5NTl9._iW8eXb9VDXzxARQaY6ple8chHOgrg1agBIScyj9t08';
  const bearer1 = 'Bearer ' + token;
  const response = await axios.get(stsBase + '/v2/user/info', {
    headers: {
      Authorization: bearer1,
    },
  });
  const result = response.data;
  console.log(result);
  res.send(result);
});

app.post('/checkout', async (req, res, next) => {
  const name = req.body.name;
  const response = await axios.post(
    stsBase + '/checkout',
    {
      entityId: client_id,
      amount: '5000',
      currency: 'MNT',
      redirect_uri: 'https://amita.hps.mn/access',
      item: [
        {
          name: name,
        },
      ],
    },
    {
      headers: {
        Authorization: bearer,
      },
    }
  );
  const result = response.data;
  console.log(result);
  res.send(result);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

