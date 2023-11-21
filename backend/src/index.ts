const express = require('express')
const app = express()
const port = 8080
const cookieParser = require("cookie-parser")
const loginRoute = require('./routes/login')

const cors = require('cors');

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:19006' // Your frontend's URL
}));

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.get('/SignUpPage', (req: any, res: any) => {
  res.send('Hello World!')
})

app.post('/login', loginRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/authorize', async (req: any, res: any) => {
  let result;
  const config = {
    issuer: 'localhost:19006',
    clientId: '<YOUR_CLIENT_ID>',
    redirectUrl: '<YOUR_REDIRECT_URL>',
    scopes: ['<YOUR_SCOPES_ARRAY>'],
  };

  try {
    //result = await authorize(config);
    // result includes accessToken, accessTokenExpirationDate and refreshToken
  } catch (error) {
    console.log(error);
    result = error;
  }

  res.send(result)
})
