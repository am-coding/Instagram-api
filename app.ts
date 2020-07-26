import { IgApiClientRealtime, withRealtime } from 'instagram_mqtt';
import { DirectThreadEntity, IgApiClient } from 'instagram-private-api';
import dotenv from "dotenv";
const ig = new IgApiClient();

dotenv.config()

async function login() {
  // basic login-procedure
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
}

(async () => {
  await login();

const userId = await ig.user.getIdByUsername('username');
const thread = ig.entity.directThread([userId.toString()]);
await thread.broadcastText('Message from node');

})();