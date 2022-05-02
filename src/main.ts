import { Account } from './global/Account';
import { EventBot } from './bots/EventBot';

function runBot() {
  const account = new Account();
  account.loadAccount().then(() => {
    const eventBot = new EventBot(account);
    eventBot.startBot();
    refreshFloorPrice(eventBot);
  });
}

async function refreshFloorPrice(eventBot: EventBot) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log('Running the refresh loop');
    await new Promise((resolve) => setTimeout(resolve, 300000));
    eventBot.checkFloorPrice();
  }
}

runBot();
