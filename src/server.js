const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const envFileName = `.env.${process.env.NODE_ENV}`;
const envFilePath = path.join(__dirname, '..', envFileName);

dotenv.config({ path: envFilePath });

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL).then((success) => {
      console.log('DB connection successful!');
    })
    app.listen(process.env.PORT, () => {
      console.log('app listening on port', process.env.PORT)
    });
  } catch (error) {
    console.log('error',error);
  }
};
connectDB();


