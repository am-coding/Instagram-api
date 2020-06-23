import { DirectThreadEntity, IgApiClient } from 'instagram-private-api';

const ig = new IgApiClient();

async function login() {
  // basic login-procedure
  ig.state.generateDevice(process.env.YOUR_USERNAME);
  await ig.account.login(process.env.YOUR_USERNAME, process.env.PASSWORD);
}

(async () => {
  await login();
  const userId = await ig.user.getIdByUsername('username'); // enter username you wanna send text to
const thread = ig.entity.directThread([userId.toString()]);

  const element  = thread.broadcastText('enter text/message');  
  await element;

  
})();
