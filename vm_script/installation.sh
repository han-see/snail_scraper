 #!/bin/bash
set -x
git clone git@github.com:han-see/snail_scraper.git
cd snail_scraper/vm_script
chmod +x *.sh
cd ..
npm install
nano .env.example
nano userInput.example
forever stopall
forever cleanlogs
npm run build:release
forever start -c "npm run start" ./
tail -f ~/.forever/*.log
