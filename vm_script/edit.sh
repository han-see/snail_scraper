 #!/bin/bash
set -x
cd snail_scraper/
forever snail_scraper
rm ~/.forever/snail-scraper.log
git pull
<<<<<<< HEAD
nano ~/snail_scraper/filterInput.json
=======
nano ~/snail_scraper/userInput.json
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
npm run build
forever --uid snail-scraper -a start -c "npm run start" ./
tail -f ~/.forever/*.log
