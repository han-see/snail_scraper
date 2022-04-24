# Snail scraper bot

This bot will look for snails from the marketplace and ping your discord if one of the filter condition is filled.

For the bot to be able to run you need to have node and git installed in your system
The bot is tested using Node v16.14.2

### Installation

`sudo bash -c "$(curl -s https://raw.githubusercontent.com/han-see/snail_scraper/main/vm_script/installation.sh)"`

Please check the .env.example and userInput.json.example and create the .env and userInput.json file
Otherwise the bot will not work.

### User input example

This is an example of how to entry snail filter for the bot to watch. The bot will look for the userInput.json file in the root directory.
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
