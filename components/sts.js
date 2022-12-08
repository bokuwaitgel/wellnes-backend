const express = require('express');
const router = express.Router();

const stsBase = 'https://test.hipay.mn';
// const client_secret = '5hPR4fs9g2Wq5ZAXWI0L2L'; prod
// const client_id = 'amitawlc'; prod
const client_secret = 'Trk4UNHt58LqDwRL4adsXV'
const client_id = 'amita001';
const bearer = 'Bearer ' + client_secret;


router.post('/getToken', async (req,res,next) => {
  const code = req.body.code;
  data = {
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: 'https://amita-test-backend.herokuapp.com/webhook',
    code: code,
    grant_type: 'authorization_code'
  }
  const response = await axios.post(stsBase+'/v2/auth/token', data)
  const result = response.data;
  console.log(result);
  res.send(result);
})

router.post('/getUserInfo', async (req,res,next) => {
  const token = req.body.token;
  //const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBOUJENzBCMDc5OEE3NUY3RTA1MzJBNjRBOEMwOUIzQiIsImlzcyI6ImFtaXRhMDAxIiwicmZ0IjoiRUExOEZDOTMxMzgzMjEyQUUwNTMyQTY1QThDMEJDMDkiLCJleHAiOjE2NjQ3Njc5NTl9._iW8eXb9VDXzxARQaY6ple8chHOgrg1agBIScyj9t08';
  const bearer1 = 'Bearer ' + token;
  const response = await axios.get(stsBase+'/v2/user/info',
    {
      headers: {
        Authorization: bearer1
      }
    })
  const result = response.data;
  console.log(result);
  res.send(result);
})

router.get('/checkout', async (req,res,next) => {
  //const code = req.body.code;
  const response = await axios.post(stsBase+'/checkout',{
    entityId: client_id,
    amount: '5000',
    currency: 'MNT',
    redirect_uri: 'http://localhost:3000/access'
  },
  {
    headers: {
      Authorization: bearer
    }
  })
  const result = response.data;
  res.send(result);
})

module.exports = router;