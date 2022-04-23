import { Scraper } from './web2_client/Scraper';
import userInput from '../userInput.json';

const scraperList: Scraper[] = [];

async function botLoop() {
  // eslint-disable-next-line no-constant-condition
  await initiateBot();
  const runBot = true;
  while (runBot) {
    console.log('Running the loop');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    scraperList.forEach((res) => res.scrapeMarketplace());
  }
}

async function initiateBot() {
  try {
    let isUserInputEmpty = true;
    while (isUserInputEmpty) {
      if (userInput.length == 0) {
        console.log('No User Input');
        process.exit(1);
      } else {
        isUserInputEmpty = false;
      }
    }
    await userInput.forEach((data) => {
      scraperList.push(new Scraper(data));
    });
  } catch (err) {
    console.error('Bot cannot be initialize', err);
  }
}

botLoop();
