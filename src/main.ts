import { scrapeMarketplace } from './web2_client/Scraper';

async function botLoop() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log('Running the loop');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    scrapeMarketplace();
  }
}

botLoop();
