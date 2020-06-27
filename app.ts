import { IgApiClientRealtime, withRealtime } from 'instagram_mqtt';
import { DirectThreadEntity, IgApiClient } from 'instagram-private-api';
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import twilio from 'twilio';
import bodyParser from 'body-parser';
import { Socket } from 'dgram';
const http = require('http');

const ig: IgApiClientRealtime = withRealtime(new IgApiClient());


const PORT = process.env.PORT || 5000;
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.SERVER_PORT || 5000;

const app = express();

app.use(cors());

const accountSid =process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_TOKEN;

const client = require('twilio')(accountSid, authToken);

const MessagingResponse = require('twilio').twiml.MessagingResponse;



app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// define a route handler for the default home page
   
app.post('/login', (req, res) => {
  (async () => {
    // this extends the IgApiClient with realtime features
    
    // normal login
      ig.state.generateDevice(req.body.username);
      await ig.account.login(req.body.username, req.body.password);
      console.log(req.body.username, req.body.password);
    // now `ig` is a client with a valid sessio
    // whenever something gets sent and has no event, this is called
    
   
    // this is called with a wrapper use {message} to only get the message from the wrapper
    ig.realtime.on('message', logEvent('messageWrapper'));
    // whenever something gets sent to /ig_realtime_sub and has no event, this is called
    // whenever the client has a fatal error
    ig.realtime.on('error', console.error);
    ig.realtime.on('close', () => console.error('RealtimeClient closed'));
    // connect    
    // this will resolve once all initial subscriptions have been sent
     await ig.realtime.connect({
         irisData: await ig.feed.directInbox().request()    
    });
    
})();
res.writeHead(302,{
  'Location':'/login',
});
res.end();

let clientMsg: any;

app.post('/', (req, res) => {
  clientMsg = req.body.Body;
  (async () => {
      const [thread] = await ig.feed.directInbox().records();

      if (clientMsg.includes('!50')) {
        let loop = clientMsg.split("!50").join('')
        for (let i = 0; i < 50; i++) {
          const element = thread.broadcastText(loop);
          await element;    
        }
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end();
      }
      const element  = thread.broadcastText(clientMsg);  
      await element;
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end();
  })();
});

/**
 * A wrapper function to log to the console
 * @param name
 * @returns {(data) => void}
 */

function logEvent(name: string) {
  return (data: any) => {
      let txt = data.message.text;
      client.messages
    .create({
       from: 'whatsapp:+14155238886',
       body: clientMsg === txt ? null : txt,
       to: `whatsapp:+91${req.body.number}`
     })
    .then((message: { sid: any; }) => console.log(message));
  }    
}
})


app.get('/login', (req, res) => {
  res.render('chat');
})


app.get('/', (req, res) => res.render('index'))

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))