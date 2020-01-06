# X-Market

#### Crypto Arbitrage Finder

Track the best opportunities between cryptocurrency exchanges.

[View](https://x-market-mvp.herokuapp.com/)


## Deploy
### Deploy locally
#### Prerequisites
 - NodeJS, npm
 - [Binance API key](https://www.binance.com/en/support/articles/360002502072)

#### Steps
 - Clone master branch
        
        $ git clone https://github.com/ntzi/X_Market.git

 - Install [NodeJS and npm](https://nodejs.org/en/)
 - Install  dependencies

        $ cd X_Market/
        $ npm install
        
 - Create .env file in *X_Market/* directory.\
    .env file must include the api key of personal account in Binance.\
    Example .env file:\
    
        BINANCE_APIKEY = my-key-from-binance

 - Start
 
        $ npm start
    In browser visit https://localhost:3000\
    Wait a minute to fetch and save data for the first time.
 
 - Stop
        
        Ctrl + C
       
 - Delete database
 
        $ npm run remove_db 

#### Tests
    
    npm test

        
        
### Deploy on Heroku

The project is ready to be deployed on a single Heroku web dyno with MongoDB.

Follow [this](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true) guide to start up.

Use MongoDB [plugin](https://elements.heroku.com/addons/mongolab) for database.

Create environment variables for the API key of a personal account in Binance.

    heroku config:set BINANCE_APIKEY=my-key-from-binance

 ## Authors
 
 * **Nikos Tziralis** - *Initial work* - [X-Market](https://github.com/ntzi/X_Market)
 
 ## License
 
 This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
