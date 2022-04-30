 #!/bin/bash
set -x
cd snail_scraper/
forever stop snail-scraper
rm ~/.forever/snail-scraper.log
git pull
npm run build:release
forever --uid snail-scraper -a start -c "npm run start" ./
tail -f ~/.forever/*.log
