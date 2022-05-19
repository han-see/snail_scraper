# Snail scraper bot

This bot will look for snails from the snail marketplace and buy it if one of the filter condition is filled.
For the bot to be able to work, you need to subscribe to the mempool service from the https://avax.chainsight.dev/.
This bot will listen to the mempool transaction to check the new snail listing or new snail price from the snail marketplace.

It will only scan snails that are listed on https://www.snailtrail.art/marketplace/snails.

Currently the bot is being set up to look for a snail floor with a discount that's set up from the .env files.
If event fulfilled the parameter that you set and under your maximum buy price, it will automatically send a transaction to buy the snail.
You can set up more filter if you want (see below how to enter user input), I haven't tested this implementation yet, so you need to test it alone if it works or not.

For the bot to be able to run you need to have node and git installed in your system
The bot is tested using Node v16.14.2

## Private key safety

These scripts require your private key to run. This is not optional; without your key nothing can be automated.

Your key is encrypted using a standard format from ethers.js via a password you provide.
Anyone with encrypted json file and .env file in would be able to decrypt the it, so DO NOT SHARE IT.

## Extra safety - separate account setup

I encourage you to use a new account that you use just for sniping with the bot. This isn't strictly required, but your private key is marginally more exposed even with the precautions we're taking. In the event that you somehow expose your keys, the most you lose are what you put in your account and not your whole portfolio.

**I'm not responsible if you lose your money or your account got hacked.
Please use this bot with your own risk**

### Installation

How to run:

1. Clone the repo
2. run npm install
3. run npm run create-account
4. Edit the .env.example file and rename it into .env
5. run the bot with the scripts inside the vm_scripts
   1. edit.sh -> to edit your filter input
   2. logs.sh -> to print the log on your console
   3. restart.sh -> it will pull the latest commit from your repo and run the bot
   4. turnoff.sh -> to turn off your bot

### Filter input example

This is an example of how to entry snail filter for the bot to watch. The bot will look for the filterInput.json file in the root directory.
The input below is an example of how to enter a snail filter
The bot will check for 3 different conditions from the input below:

1. The bot will look for a snail with family class Garden with a maximum price of 5.5 AVAX or a discount price of 10% to the next cheapest on sale snail
2. The bot will look for a snail with family class Atlantis with a maximum price of 20 AVAX or a discount price of 15% to the next cheapest on sale snail
3. The bot will look for a snail with a purity of 11 and maxPrice of 10 AVAX or a discount price of 20% to the next cheapest on sale snail
   You can add extra filter for it. For the enums see Family.ts under src/common/Family.ts

   ```
   [
       {
       "discount": 0.1,
       "maxPrice": 5.5 (MaxPrice in Avax),
       "filter": {
       "family": 1,
       "klass": xx,
       "generation": xx,
       "adaptations" : [],
       "purity": xx,
       "gender" : xx,
       "visuals" : xx
       },
       {
       "discount": 0.15,
       "maxPrice": 20 (MaxPrice in Avax),
       "filter": {
       "family": 5,
       "klass": xx,
       "generation": xx,
       "adaptations" : [],
       "purity": xx,
       "gender" : xx,
       "visuals" : xx
       },
       {
       "discount": 0.20,
       "maxPrice": 10 (MaxPrice in Avax),
       "filter": {
       "family": xx,
       "klass": xx,
       "generation": xx,
       "adaptations" : [],
       "purity": 11,
       "gender" : xx,
       "visuals" : xx
       }
   ]
   ```

Any bug or suggestion just contact me under:
russellthewildexplorer@gmail.com
