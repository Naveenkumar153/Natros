const dotenv = require('dotenv');
const path = require('path');

const envFileName = `.env.${process.env.NODE_ENV}`
// Load the environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, envFileName) });

const app  = require('./app');


app.listen(process.env.PORT, () => {
    console.log('app listening on port',process.env.PORT);
});