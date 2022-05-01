import { Account } from './global/Account';
import { EventBot } from './bots/EventBot';

function runBot() {
  const account = new Account();
  account.loadAccount().then(() => {
    const eventBot = new EventBot(account);
    eventBot.startBot();
  });
}

runBot();
