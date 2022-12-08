const express = require('express');
const router = express.Router();

//google
const {google} = require('googleapis');
const GOOGLE_CLIENT_ID = '895950892526-teg3cd13d40nvlrigl71l89cjo79nep5.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRED = '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'
const REFRESH_TOKEN = '1//04KRYySOQNlqACgYIARAAGAQSNwF-L9IrX-iRt5ZQA4ddBddCrbC8VvWPFqtMZZHoMb0u5RBg5iUcqywICeYq04saVYy5mp0tSvI'
// const calendarID = 'e0ae2d8eec5705fb51d423292b9db0a6e56fb8eeb6d5be17430f090ca70011ab@group.calendar.google.com'
//378382094535-nkiagmh7esjcuidclb7625lur4d2b2uc.apps.googleusercontent.com  -> client id
//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  -> client secret

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRED,
)
oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const calendar = google.calendar('v3')

//google calendar

router.post('/addGoogleCalender', async (req, res, next) => {
    const eventStartTime = req.body.start;
    const eventEndTime = req.body.end;
    const summary = req.body.summary;
    const description = req.body.description;
    const calendarID = type ? '86d33bbafd1382bf6eb231d72842054f9292d96daae296c75658bab8c738c9ee@group.calendar.google.com' :'e0ae2d8eec5705fb51d423292b9db0a6e56fb8eeb6d5be17430f090ca70011ab@group.calendar.google.com'
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
            timeZone: 'Asia/Ulaanbaatar',
          },
          end: {
            dateTime: eventEndTime,
            timeZone: 'Asia/Ulaanbaatar',
          }
        }
      })
      res.send(response)
    }catch(error){
      next(error)
    }
  })
  
router.post('/getGoogleTime', async (req,res,next) => {
    const eventStartTime = req.body.start;
    const eventEndTime = req.body.end;
    const type = req.body.type;
    const calendarID = type ? '86d33bbafd1382bf6eb231d72842054f9292d96daae296c75658bab8c738c9ee@group.calendar.google.com' :'e0ae2d8eec5705fb51d423292b9db0a6e56fb8eeb6d5be17430f090ca70011ab@group.calendar.google.com'
    try{
      oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
      const response = await calendar.events.list({
        auth: oauth2Client,
        calendarId: calendarID,
        timeMin: (eventStartTime),
        timeMax: (eventEndTime),
      })
      const items = response['data']['items']
      console.log(items)
      res.send(items)
    }catch(error){
      next(error)
    }
  })
  module.exports = router;