 #!/bin/bash
set -x
cd snail_scraper/
forever snail_scraper
rm ~/.forever/snail-scraper.log
git pull
nano ~/snail_scraper/userInput.json
npm run build
forever --uid snail-scraper -a start -c "npm run start" ./
tail -f ~/.forever/*.log
