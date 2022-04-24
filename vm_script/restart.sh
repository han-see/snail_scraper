 #!/bin/bash
set -x
cd snail_scraper/
forever stopall
forever cleanlogs
git pull
npm run build:release
forever start -c "npm run start" ./
tail -f ~/.forever/*.log
