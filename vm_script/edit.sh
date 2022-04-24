 #!/bin/bash
set -x
cd snail_scraper/
forever stopall
forever cleanlogs
git pull
nano ~/snail_scraper/userInput.json
npm run build
forever start -c "npm run start" ./
tail -f ~/.forever/*.log
